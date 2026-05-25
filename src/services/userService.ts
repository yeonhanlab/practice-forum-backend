import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";

const createUser = async (data: UserCreateInput) => {
    return prisma.user.create({
        data
    });
};

export default {
    createUser,
};
