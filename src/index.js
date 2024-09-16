import { Connection } from "./DbConfig/DBConnection.js";
import { app } from "./app.js";

Connection().then(() => {
  app.listen(3000, () => {
    console.log("🏁 Go");
  });
});
