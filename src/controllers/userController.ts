import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import userService from "../services/userService.ts";
import bcrypt from "bcrypt";
import passwordUtil from "../utils/password/passwordUtil.ts";
import { LoginInputType } from "../schemas/user/login.ts";


const createUser = async (req: Request, res: Response) => {

    try {
    // 기능 들어가는 자리
    // 프론트엔드가 요청한 정보를 꺼냄
    // 원래 req.body에는 string이 들어있는데 즉 프론트엔드에서 백엔드로 보내주는 정보는 스트링인데
    // index.ts 파일 app.use(express.json());에서 객체화된 것

    const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
        req.body;

    // JSON -> 객체로 바꿀 때 가능한건, string, boolean, number, null만 가능
    // 날짜는 JSON.parse()래도 string

    const userData: UserCreateInput = {
        username,
        password: await passwordUtil.hashPassword(password),
        name,
        nickname,
        email,
        phoneNumber,
        birthdate: birthdate ? new Date(birthdate) : null,
        gender,
        role,
    };

    // userData를 가지고 DB에 저장 -> service로 보내야함
    const newUser = await userService.createUser(userData);
    res.status(201).json(userData);

    } catch (error) {
        // 모든 에러에 대해서 처리를 해줄 순 없음.
        // 내가 처리해줄 수 있는 대표적 에러에 대해서만 대처함
        // 매개변수인 error는 unknown 타입임
        // unknown 타입은 any 타입처럼 모든 값들이 저장될 수 있는 타입이지만,
        // 사용하기 위해서는 내로잉(타입 좁힘)을 통해 사용이 가능
        // Unique로 걸어둔
        // username이 겹칠 때
        // nickname이 겹칠 때
        // email이 겹칠 때

        if (error instanceof Error) {
            switch (error.message) {
                case "ALREADY_EXISTS_USERNAME":
                    res.status(409).json({ error: "이미 사용 중인 아이디입니다. " });
                    return;
                case "ALREADY_EXISTS_EMAIL":
                    res.status(409).json({ error: "이미 가입된 이메일입니다. " });
                    return;
                case "ALREADY_EXISTS_NINKNAME":
                    res.status(409).json({ error: "이미 사용 중인 닉네임입니다. " });
                    return;
                default:
                    console.log(error);
                    res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다. " });
            }
        }

        console.log(error);
        res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다." });
    }

};

const login = (req: Request, res: Response) => {
    const loginData: LoginInputType = req.body;
    const result = userService.login(loginData);
};



export default {
    createUser,
    login,
};