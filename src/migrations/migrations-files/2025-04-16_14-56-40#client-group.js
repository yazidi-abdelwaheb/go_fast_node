import { COMPANY_ID, GROUP_ID_CLIENTS } from "../utils.js";
import { Types } from "mongoose";
import Groups from "../../modules/groups/groups.schema.js";
import { setupMongoServer } from "../../config/db.config.js";

const clientGroupMigration = async () => {
  try {
    // Your migration logic here
    await setupMongoServer()
    const exists = await Groups.exists({ _id: GROUP_ID_CLIENTS });
    if(exists){
      console.log("Group clients alredy exists!");
    }else{
      await new Groups({
      _id : new Types.ObjectId(GROUP_ID_CLIENTS),
      companyId : new Types.ObjectId(COMPANY_ID),
      label :"Clients",
      code : "clients",
    }).save()

    console.log("Group clients created successfully.");
    }
    
    
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    if (process.env.NODE_ENV !== process.env.PROD_MODE) {
      process.exit(0);
    }
  }
};

// Run the migration
clientGroupMigration();
