import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorHandler } from "./middlewares/ErrorHandler.middleware.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// Router Import
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import reviewRouter from "./routes/review.routes.js";
import addressRouter from "./routes/address.routes.js";


// Router Declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/address", addressRouter);


app.use(ErrorHandler);


export { app };