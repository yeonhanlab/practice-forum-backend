import { ZodType } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {

         const result = await schema.safeParseAsync(req.body);

         if (!result.success) {

             const errorMessage = result.error.issues.map(issue => ({
                 field: issue.path.join("."),
                 message: issue.message,
             }));

             res.status(400).json({ message: "잘못된 입력값입니다.", errors: errorMessage});
         }


         // result.success가 true(성공)의 경우가 여기에서 실행됨 -> 이 함수를 끝내고 컨트롤러로 진행되어야 함
        req.body = result.data;
         next();
    }
};