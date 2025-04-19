import { Router } from "express";
import Controller from "./menu.controller.js";

const router = Router();

router.get("/", Controller.getMenu);
router.get("/features", Controller.getFeatures);
router.get("/get-actions", Controller.getMyActions);

export default router;
