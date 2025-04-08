import multer from 'multer';
import fs from 'fs';
import path from 'path';


const createDirectoriesphotos = () => {
  const publicDirectory = path.join('src', 'public');
  const avatarDirectory = path.join(publicDirectory, 'avatars');

  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true });
  }
  if (!fs.existsSync(avatarDirectory)) {
    fs.mkdirSync(avatarDirectory, { recursive: true });
  }
};


const uploadImage = (dir = 'public', fileName = null) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const publicDirectory = path.join('src', dir);
      const avatarDirectory = path.join(publicDirectory, 'avatars');
      cb(null, avatarDirectory);
    },
    filename(req, file, cb) {
      const timestamp = new Date().getTime();
      const uniqueName = `${timestamp}--${file.originalname}`;
      cb(null, uniqueName); 
    },
  });

  
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
    
    if (isValid) {
      return cb(null, true); 
    }
    cb(new Error('Seules les images sont autorisées'), false); 
  };

  
  return multer({
    storage,
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MO
  }).single('avatar');
};

export { uploadImage , createDirectoriesphotos };
