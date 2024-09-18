import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

import { UserRoute } from "./Routes/UserRoutes.js";

app.use("/api/v1/User", UserRoute);

export { app };
