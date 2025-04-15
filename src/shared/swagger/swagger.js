import swaggerAutogen from "swagger-autogen";
import "dotenv/config";
import { doc } from "./utils.js";

const outputFile = "./swagger-output.json";
const endpointsFile = ["../../app.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc).then(
  async () => {
    await import("../../app.js");
  }
);
