import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { LoginInputType } from "../schemas/user/login.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";
import jwtUtil from "../utils/jwt/jwtUtil.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const errorMessage = error.message;
                if (errorMessage.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME")
                }
                if (errorMessage.includes("email")){
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("ALREADY_EXISTS_NINKNAME");
            }
        }
        throw new Error("UNKNOWN_ERROR"); // return과 같은데 값을 리턴하는게 아니라 에러를 리턴하는 키워드

    }
};

const login = async (data: LoginInputType) => {
    const user = await prisma.user.findUnique({
        where: {
            username: data.username,

        },
    });

    if (!user || user.deletedAt ) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await passwordUtil.verifyPassword(data.password, user.password);
    if (!isValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 아이디와 비밀번호가 일치하는 정보가 있다는 뜻
        const token = jwtUtil.generateToken(user.id);

        const { password, deletedAt, ...safeUserInfo } = user; // 구조분해할당을 통해 정보를 걸러줌

        return {
            user: safeUserInfo,
            token,
        };


};

export default {
    createUser,
    login,
};
