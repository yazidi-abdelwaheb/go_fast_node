//import { askQuestion } from "../utils.js";
import mongoose from "mongoose";
import { setupMongoServer } from "../../config/db.config.js";
import Company from "../../modules/companys/companys.shema.js";

const initCompanyMigration = async () => {
  try {
    // Your migration logic here
    await setupMongoServer();

    const existingCompany = await Company.findOne({ code: "go_fast" });
    if (existingCompany) {
      console.log("Company Go Fast already exists.");
      return;
    }

    const data = {
      _id : new mongoose.Types.ObjectId("67bf7cf4c7ef2a1a638f6144"),
      label: "Go Fast",
      code: "go_fast",
    };
    await new Company(data).save();

    console.log("Company saved successfully.");
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    process.exit(0);
  }
};

// Run the migration
initCompanyMigration();
