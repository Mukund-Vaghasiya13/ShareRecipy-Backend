import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

import { UserRoute } from "../Routes/UserRoutes.js";

app.use("/api/v1/User", UserRoute);

export { app };
