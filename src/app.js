import express from "express";
import cors from "cors";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import authRouter from "./modules/auth/auth.routers.js";
import userRouter from "./modules/users/users.routers.js";
import featuresRoutes from "./modules/features/features.routers.js";
import groupsRoutes from "./modules/groups/groups.routers.js";
import productsRoutes from "./modules/products/products.routers.js";
import ordersRouters from "./modules/orders/orders.routers.js";
import menuRouters from "./modules/menu/menu.routers.js";
import textsRouters from "./modules/texts/text.routers.js";
import userFeatureRouters from "./modules/user-feature/user-features.routers.js";
import { isAuth } from "./middlewares/auth.middlewares.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, `${process.env.HOST}:${process.env.PORT}`],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Swagger documentation
const swaggerDocumentFile = "src/shared/swagger/swagger-output.json";
const swaggerDocument = JSON.parse(
  fs.readFileSync(swaggerDocumentFile, "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define endpoint.
app.use("/api/auth", authRouter);
app.use("/api/users", isAuth, userRouter);
app.use("/api/features", isAuth, featuresRoutes);
app.use("/api/groups", isAuth, groupsRoutes);
app.use("/api/products", isAuth, productsRoutes);
app.use("/api/orders", isAuth, ordersRouters);
app.use("/api/menu", isAuth, menuRouters);
app.use("/api/texts", isAuth, textsRouters);
app.use("/api/user-feature", isAuth, userFeatureRouters);



// Define endpoint for photos.
app.use("/media/photo/user", isAuth)
app.use("/media/photo/product", isAuth)

export default app;
