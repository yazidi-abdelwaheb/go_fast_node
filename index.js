import app from "./src/app.js";
import { setupMongoServer } from "./src/config/db.config.js";
import migration_system from "./src/migrations/index.js";
import {
  migration_system_commands_names,
  init_migration,
} from "./src/migrations/utils.js";
import { createDirectoriesPhotos } from "./src/shared/shared.exports.js";

async function main() {
  if (migration_system_commands_names.indexOf(process.argv[2]) !== -1) {
    /**
     * run the migration command and exit.
     */
    await migration_system();
  } else {
    /**
     * Run server
     */

    // define a base url for the server
    const PORT = process.env.PORT;
    const HOST = process.env.HOST;
    const BASE_URL = `${HOST}:${PORT}`;

    // Conecte to database
    await setupMongoServer();

    /**
     * cerate directories media if not existe.
     */
    createDirectoriesPhotos()

    // Initialize the migration system if mode is prod
    if (process.env.NODE_ENV === process.env.PROD_MODE) {
      await init_migration();
    }

    // Run server.
    app.listen(PORT, () => {
      console.log(
        `Server running at ${BASE_URL}.\nDocumentions apis is available at ${BASE_URL}/api-docs.`
      );
    });
  }
}

main();
