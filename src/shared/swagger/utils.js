import fs from "fs";
import path from "path";
import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "url";

export const doc = {
  info: {
    version: "0.1.0",
    title: "Go Fsat Delivery",
    description: "My Api node for delivery services",
  },
  servers: [
    {
      url: `${process.env.HOST}:${process.env.PORT}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Authentication related routes",
    },
    {
      name: "Users",
      description: "Endpoints for users operations",
    },
    {
      name: "Groups",
      description: "Endpoints for groups operations",
    },
    {
      name: "Features",
      description: "Endpoints for features operations",
    },
    {
      name: "User-Features",
      description: "Endpoints for user-features relation operations",
    },
    {
      name: "Products",
      description: "Endpoints for products operations",
    },
    {
      name: "Orders",
      description: "Endpoints for orders operations",
    },
    {
      name: "Texts",
      description: "Endpoints for texts operations to translate",
    },
    {
      name: "Menu",
      description: "Endpoints for Menu option",
    },
  ],
};

/**
 * function to create file swagger-output.json if not existe
 * and get object json to documentation apis swagger
 * @returns {Promise<object>}object json to documentation apis swagger
 */
export const swaggerDocumentJson = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "swagger-output.json");

  const outputFile = "src/shared/swagger/swagger-output.json";

  if (!fs.existsSync(filePath)) {
    await swaggerAutogen({ openapi: "3.0.0" })(
      outputFile,
      ["src/app.js"],
      doc
    ).then(async () => {
      await import("../../app.js");
    });
  }

  return await JSON.parse(fs.readFileSync(outputFile, "utf-8"));
};
