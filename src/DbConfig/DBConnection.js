import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_STRING, {
      dbName: "Recipes",
    });
    console.log("Connection Done");
  } catch (e) {
    console.log(`🤖 Stopped 🛑 ${e.message}`);
  }
};

export { Connection };
