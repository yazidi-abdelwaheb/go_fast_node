import { COMPANY_ID } from "../utils.js";
import  { Types } from "mongoose";
import { setupMongoServer } from "../../config/db.config.js";
import Company from "../../modules/companys/companys.schema.js";

const initCompanyMigration = async () => {
  try {
    // Your migration logic here
    await setupMongoServer();

    //deleted all old company from data base
    await Company.deleteMany();

    console.log("Creating new company...");

    const data = {
      _id: new Types.ObjectId(COMPANY_ID),
      label: "Go Fast",
      code: "go_fast",
    };
    await new Company(data).save();

    console.log("Company saved successfully.");
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    if (process.env.NODE_ENV !== process.env.PROD_MODE) {
      process.exit(0);
    }
  }
};

// Run the migration
initCompanyMigration();
