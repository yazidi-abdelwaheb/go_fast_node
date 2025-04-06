import { askQuestion } from "../utils.js";
import Users from "../../modules/users/users.schema.js";
import { setupMongoServer } from "../../config/db.config.js";
import { Types } from "mongoose";

const validateInput = async(field, value) => {
  switch (field) {
    case "first_name":
      if (!value || value.length < 3 || !/[a-zA-Z]/.test(value)) return "First name must be at least 3 characters.";
      break;
    case "last_name":
      if (!value || value.length < 3 || !/[a-zA-Z]/.test(value)) return "Last name must be at least 3 characters.";
      break;
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format.";
      if(await Users.findOne({ email: value})) return "Email already used.";
      break;
    case "password":
      if (value.length < 8 || !/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
        return "Password must be at least 8 characters, contain a letter and a number.";
      }
      break;
    default:
      return null;
  }
  return null;
};


const getValidatedInput = async (field, message) => {
  let value;
  while (true) {
    value = await askQuestion(message);
    const error = await validateInput(field, value);
    if (!error) break;
    console.log(`${error}`);
  }
  return value;
};


const createSuperAdminMigration = async() => {
  try {
    // Your migration logic here

    await setupMongoServer();

    const existingAdmin = await Users.findOne({ type: "super" });
    
    if (existingAdmin) {
      console.log("Super admin already exists.");
      return;
    }

    
    const last_name = await getValidatedInput("last_name", "Enter your Last name: ");
    const first_name = await getValidatedInput("first_name", "Enter your First name: ");
    const email = await getValidatedInput("email", "Enter your Email: ");
    const password = await getValidatedInput("password", "Enter your Password: ");

    const superAdmin = new Users({
      email,
      last_name,
      first_name,
      password,
      type: "super",
      companyId : new Types.ObjectId("67bf7cf4c7ef2a1a638f6144"),
      isActive: true,
    });
    
    
    

    await superAdmin.save();
    console.log(`\nSuper admin ${last_name} ${first_name} created successfully!`);
    
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  }finally {
    process.exit(0);
  }
}

// Run the migration
createSuperAdminMigration();

