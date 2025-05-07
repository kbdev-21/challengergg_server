import { Router } from "express";
import { accountsController } from "../controllers/accountsController.js";

const router = Router();

router.get("/api/accounts/by-riotid/:gamename/:tagline", accountsController.getAccountByRiotId);
router.get("/api/accounts/by-puuid/:puuid", accountsController.getAccountByPuuid);
router.get("/api/accounts/search", accountsController.searchAccounts);
router.get("/api/accounts/stats/by-puuid/:puuid", accountsController.getAccountStats);

export default router;
