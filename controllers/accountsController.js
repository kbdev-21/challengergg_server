import { accountsService } from "../services/accountsService.js";
import { accountStatsService } from "../services/accountStatsService.js";

async function getAccountByRiotId(req, res) {
  try {
    const { gamename, tagline } = req.params;
    if (!gamename || !tagline) {
      return res.status(400).json({ error: "Invalid gamename or tagline" });
    }
    const accountDto = await accountsService.getAccountByRiotId(
      gamename,
      tagline
    );
    if (!accountDto) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(accountDto);
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function getAccountByPuuid(req, res) {
  try {
    const { puuid } = req.params;
    
    const accountDto = await accountsService.getAccountByPuuid(puuid);
    if (!accountDto) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(accountDto);
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function searchAccounts(req, res) {
  try {
    const { query } = req.query; // Get search query from URL
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const searchedAccountsDto =
      await accountsService.getSearchedAccountsBySearchKey(query);
    res.status(200).json(searchedAccountsDto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAccountStats(req, res) {
  try {
    const { puuid } = req.params;
    if (!puuid) {
      return res.status(400).json({ error: "Invalid puuid" });
    }

    const accountStats = await accountStatsService.getAccountChampStatsByPuuid(
      puuid
    );

    res.status(200).json({ stats: accountStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const accountsController = {
  getAccountByRiotId,
  searchAccounts,
  getAccountStats,
  getAccountByPuuid,
};
