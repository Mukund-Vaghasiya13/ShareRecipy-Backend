import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import fs from "fs";

cloudinary.config({
  cloud_name: "mukund13",
  api_key: "595329826483349",
  api_secret: "dwo9O97G-P2kp9314mHHElG-AhE", // Click 'View API Keys' above to copy your API secret
});

const uplodeCloudanry = async (FilePath) => {
  try {
    if (!FilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(FilePath, {
      resource_type: "auto",
    });
    //MARK: Debug
    //console.log("file is uploaded on cloudinary ", response.url);
    await fs.promises.unlink(file.path);
    return response;
  } catch {
    await fs.promises.unlink(file.path);
    return null;
  }
};

const removeProfileImage = async (url) => {
  const parts = url.split("/"); // Split URL by '/' it return array of string ["https:", "", "res.cloudinary.com","mukund13", "image", "upload", "v1719647016", "n3yqxafu99ky6nuvd0hx.png"]
  const fileName = parts.pop(); // Get the last part (filename with extension)
  const id = fileName.split(".").shift(); // Split filename by '.' and get the first element of array ["n3yqxafu99ky6nuvd0hx","png"]
  await cloudinary.uploader.destroy(id, (error, success) => {
    if (error) {
      console.log(`Error in removing image in cloud ☁️ ${error}`);
    }
  });
};

export { uplodeCloudanry, removeProfileImage };
