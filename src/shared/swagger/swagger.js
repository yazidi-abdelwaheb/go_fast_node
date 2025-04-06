import swaggerAutogen from "swagger-autogen";
import "dotenv/config";
const doc = {
  info: {
    title: "Go Fsat Delivery",
    description: "My Api node for delivery services",
  },
  servers: [
    {
      url: `${process.env.HOST}:${process.env.PORT}`,
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFile = ["../../app.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc).then(
  async () => {
    await import("../../app.js");
  }
);
