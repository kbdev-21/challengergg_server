import { Router } from "express";
import { championsController } from "../controllers/championsController.js";

const router = Router();

router.get("/api/champions/by-name/:championName", championsController.getChampion);
router.get("/api/champions", championsController.getAll);

export default router;
