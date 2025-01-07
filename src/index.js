import { Connection } from "./DbConfig/DBConnection.js";
import { app } from "./app.js";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

Connection().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("🏁 Go");
  });
});
