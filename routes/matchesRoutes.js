import { Router } from "express";
import { matchesController } from "../controllers/matchesController.js";

const router = Router();

router.get("/api/matches/:matchId", matchesController.getMatch);
router.get("/api/matches/by-puuid/:puuid", matchesController.getAccountMatches);

export default router;
