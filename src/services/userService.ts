import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { LoginInputType } from "../schemas/user/login.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";



const createUser = async (data: UserCreateInput) => {
    try {
    return await prisma.user.create({
        data,
    });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                // 중복된 칼럼이 어떤 것인지에 대한 정보는
                // error.meta?.target에 들어있는데 이 프로퍼티 타입은 string[] | undefined
                const errorMessage = error.message;
                if (errorMessage.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN_ERROR");
            }
        }

        throw new Error("UNKNOWN_ERROR");

    }
};

const login = async (data: LoginInputType) => {
    try {
        // prisma.테이블.findUnique(조건객체) : SELECT 명령 (단, Unique 칼럼을 통해)

        const user = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
        });

        // 검색을 했는데 해당하는 내용이 없는건, 에러가 아님.
        // DB에서 조회한 내용인 user가 없거나, deletedAt의 값이 있으면
        if (!user || user.deletedAt)  {
            throw new Error("INVALID_CREDENTIALS")
        }

        const isValid = await passwordUtil.verifyPassword(data.password, user.password);
        if (!isValid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        // 아이디와 비밀번호가 일치하는 정보가 있다는 뜻



    } catch (error) {

    }
};

export default {
    createUser,
    login,
};
