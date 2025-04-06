import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

//const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?authSource=admin${process.env.ENV.toLowerCase() !== 'local' ? '&replicaSet=rs0' : ''}`;

const mongoUri = `mongodb://localhost:27017/${process.env.DB_NAME}`;

export const setupMongoServer = async () => {
  try {
    await mongoose.connect(mongoUri)
    console.info('Database connected successfully !!');
  } catch (e) {
    console.error(e);
    throw e;
  }
};