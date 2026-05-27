import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import userService from "../services/userService.ts";
import bcrypt from "bcrypt";
import passwordUtil from "../utils/password/passwordUtil.ts";


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
        console.log(error);
        res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다." });
    }

};



export default {
    createUser,
};