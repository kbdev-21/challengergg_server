import { accountsService } from "../services/accountsService.js";

async function getAccount(req, res) {
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

async function searchAccounts(req, res) {
  try {
    const { query } = req.query; // Get search query from URL
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const searchedAccountsDto = await accountsService.getSearchedAccountsBySearchKey(
      query
    );
    res.status(200).json(searchedAccountsDto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const accountsController = {
  getAccount,
  searchAccounts,
};
