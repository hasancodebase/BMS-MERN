import multer from "multer";

let upload;

if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) {
  const cloudinary = await import("cloudinary");
  const { CloudinaryStorage } = await import("multer-storage-cloudinary");
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: { folder: "bms-mern", allowed_formats: ["jpg","jpeg","png","webp"] },
  });
  upload = multer({ storage });
} else {
  upload = multer({ storage: multer.memoryStorage() });
}

export { upload };