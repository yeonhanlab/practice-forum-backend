import dotenv from 'dotenv';
import express from "express";
import userRouter from "./routes/userRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 프론트엔드가가 하는 요청(Request)에 대하여 경로 Routing 등록
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});