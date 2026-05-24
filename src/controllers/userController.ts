import { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {


    // 기능 들어가는 자리
    // 프론트엔드가 요청한 정보를 꺼냄
    // 원래 req.body에는 string이 들어있는데 즉 프론트엔드에서 백엔드로 보내주는 정보는 스트링인데
    // index.ts 파일 app.use(express.json());에서 객체화된 것

    const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
        req.body;

    // JSON -> 객체로 바꿀 때 가능한건, string, boolean, number, null만 가능
    // 날짜는 JSON.parse()래도 string

    const newUser = {
        username,
        password,
        name,
        nickname,
        email,
        phoneNumber,
        birthdate: birthdate? new Date(birthdate) : null,
        gender,
        role,
    }

    // newUser를 가지고 DB에 저장 -> service로 보내야함

};



export default {
    createUser,
};