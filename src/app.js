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
import path from "path";
import { swaggerDocumentJson } from "./shared/swagger/utils.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      `${process.env.HOST}:${process.env.PORT}`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Swagger documentation
 * create swagger doc if not existe.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(await swaggerDocumentJson()));

// Define endpoint.
app.use("/api/auth", authRouter /** #swagger.tags =["Auth"] */);
app.use("/api/users", isAuth, userRouter /** #swagger.tags =["Users"] */);
app.use(
  "/api/features",
  isAuth,
  featuresRoutes /** #swagger.tags =["Features"] */
);
app.use("/api/groups", isAuth, groupsRoutes /** #swagger.tags =["Groups"] */);
app.use(
  "/api/products",
  isAuth,
  productsRoutes /** #swagger.tags =["Products"] */
);
app.use("/api/orders", isAuth, ordersRouters /** #swagger.tags =["Orders"] */);
app.use("/api/menu", isAuth, menuRouters /** #swagger.tags =["Menu"] */);
app.use("/api/texts", isAuth, textsRouters /** #swagger.tags =["Texts"] */);
app.use(
  "/api/user-feature",
  isAuth,
  userFeatureRouters /** #swagger.tags =["User-Features"] */
);

// Define endpoint for photos.
app.use("/private", isAuth, express.static(path.join("src", "private")));

app.use((req, res, next) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

export default app;
