import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * Ensures the necessary directories for image uploads exist.
 * This includes the main private directory and the avatars subdirectory.
 */
const createDirectoriesPhotos = () => {
  const publicDirectory = path.join("src", "private");
  const avatarDirectory = path.join(publicDirectory, "avatars");

  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true });
  }

  if (!fs.existsSync(avatarDirectory)) {
    fs.mkdirSync(avatarDirectory, { recursive: true });
  }
};

/**
 * Multer middleware for uploading images.
 * - Stores image files in a given directory (default: "private/avatars")
 *
 * @param {string} dir - Target directory (default: "private")
 * @param {string} fieldName - Form field name for the file input (default: "avatar")
 * @returns {Function} Multer middleware for handling single image upload
 */
const uploadImage = (dir = "private", fieldName = "avatar") => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const uploadPath = path.join("src", dir, "avatars");
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const timestamp = Date.now();
      const uniqueName = `${timestamp}--${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);

    if (isValid) {
      return cb(null, true);
    }

    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed."), false);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
  }).single(fieldName);
};

export { uploadImage, createDirectoriesPhotos };
