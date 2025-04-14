import swaggerAutogen from "swagger-autogen";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const doc = {
  info: {
    version:"0.1.0",
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
      name: 'Auth',
      description: 'Authentication related routes',
    },
    {
      name: 'Users',
      description: 'Endpoints for user operations',
    },
    {
      name: 'Groups',
      description: 'Endpoints for group operations',
    },
    {
      name: 'Features',
      description: 'Endpoints for feature operations',
    },
    {
      name: 'User-Features',
      description: 'Endpoints for user-features operations',
    },
    {
      name: 'Products',
      description: 'Endpoints for product operations',
    },
    {
      name: 'Orders',
      description: 'Endpoints for order operations',
    },
    {
      name: 'Menu',
      description: 'Endpoints for get Menu',
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

export const cerateSwaggerOutput = ()=>{
  /*const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const filePath = path.join(__dirname ,"swagger-output.json");

  if(!fs.existsSync(filePath)){
    swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc).then(
      async () => {
        await import("../../app.js");
      }
    );
  }

  console.log(filePath);*/
  
  

}