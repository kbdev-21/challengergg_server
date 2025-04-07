import { matchesService } from "../services/matchesService.js";

async function getMatch(req, res) {
  try {
    const matchDto = await matchesService.getAndSaveMatchByMatchId(req.params.matchId);
    if (!matchDto) {
      return res.status(404).json({ error: "Match not found" });
    }
    res.status(200).json(matchDto);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function getAccountMatches(req, res) {
  try {
      const puuid = req.params.puuid;
      const { start = 0, count = 20, queueFilter = "all" } = req.query; // Default values: start = 0, count = 10
      const matches = await matchesService.getMatchesByPuuidOnDb(
        puuid,
        start,
        count,
        queueFilter
      );
      if (!matches) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.status(200).json({matches: matches});
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const matchesController = {
  getMatch,
  getAccountMatches
};
