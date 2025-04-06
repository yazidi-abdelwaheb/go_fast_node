//import { askQuestion } from "../utils.js";

import { setupMongoServer } from "../../config/db.config.js";
import Texts from "../../modules/texts/text.shema.js";
import { loadData } from "../utils.js";

const addTextsMigration = async () => {
  try {
    // Your migration logic here

    //load data from file  ../data/
    let texts;
    try {
      texts = await loadData("translations");
    } catch (error) {
      throw new Error(error.message);
    }

    // connect to database
    await setupMongoServer();

    for await (const text of texts) {
      const textAdded = new Texts(text);
      await textAdded.save();
    }
    console.log("Texts added successfully.");
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    process.exit(0);
  }
};

// Run the migration
addTextsMigration();
