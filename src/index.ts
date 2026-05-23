import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});