import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
    cloud_name: "da4hoepwl",
    api_key: "271896443944759",
    api_secret: "-D4qMj5MWx4aQg77JaqTTp0-MIw"
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatar"
    }
});

const upload = multer({ storage: cloudinaryStorage }).single("avatar");

export default upload;