import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mukund:8320017126@cluster0.vn1ihop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "Recipes",
      }
    );
    console.log("Connection Done");
  } catch (e) {
    console.log(`🤖 Stopped 🛑 ${e.message}`);
  }
};

export { Connection };
