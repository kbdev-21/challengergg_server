import { championsService } from "../services/championsService.js";

async function getChampion(req, res) {
  try {
    const { championName } = req.params;

    const champions = await championsService.getChampionsByName(
      championName
    );

    return res.status(200).json({champions: champions});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAll(req, res) {
  try {
    const champions = await championsService.getAllChampions();

    return res.status(200).json({champions: champions});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const championsController = {
  getChampion,
  getAll,
};
