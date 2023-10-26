import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleUpload(file, uploadFolder) {
  try {
    const res = await cloudinary.uploader.upload(file.path, {
      folder: process.env.CLOUDINARY_FOLDER + "/" + uploadFolder,
    });

    return res;
  } catch (err) {
    console.log(err);
  }
}

// cloudinary.v2.uploader.destroy('Asset_2_bdxdsl', function(error,result) {
//   console.log(result, error) })
