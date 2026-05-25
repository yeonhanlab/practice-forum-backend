import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";



const createUser = async (data: UserCreateInput) => {
    try {
    return prisma.user.create({
        data,
    });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                // 중복된 칼럼이 어떤 것인지에 대한 정보는
                // error.meta?.target에 들어있는데 이 프로퍼티 타입은 string[] | undefined
                const target = error.meta?.target as string[];
                if (target?.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (target?.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN_ERROR");
            }
        }

        throw new Error("UNKNOWN_ERROR");

    }
};

export default {
    createUser,
};
