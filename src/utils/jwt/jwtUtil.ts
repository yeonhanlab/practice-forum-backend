import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "";


export interface DecodedToken extends JwtPayload{
    id: number;
}


const generateToken = (userId: number) => {
    // jwt.sign(신분증에들어갈정보, 열쇠, 옵션) : 신분증을 위한, 암호화 하는 메소드, 리턴값은  string
    return jwt.sign({ id: userId }, SECRET_KEY, {
        expiresIn: "1d",
    });
};

const verifyToken = (token: string) => {
    // jwt.verify(토큰, 열쇠) : 암호화된 토큰을 복화하는 메소드. 리턴값은 객체
    // 정확히는 리턴값은 JwtPayload = {} 즉 JwtPayload 타입의 빈 객체가 리턴됨
    return jwt.verify(token, SECRET_KEY) as DecodedToken;
};

export default {
    generateToken,
    verifyToken,
};
