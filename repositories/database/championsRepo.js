import { Champion } from "../../models/Champion.js";

async function saveToDb(champion) {
  try {
    const returnChampion = await Champion.findOneAndUpdate(
      { code: champion.code },
      {
        code: champion.code,
        name: champion.name,
        position: champion.position,
        picks: champion.picks,
        wins: champion.wins,
        pickRate: champion.pickRate,
        winRate: champion.winRate,
        powerScore: champion.powerScore,
        tier: champion.tier,
      },
      { upsert: true, new: true, runValidators: true } // runValidators ensures data is valid
    );
    return returnChampion;
  } catch (error) {
    throw new Error(`Error saving champion: ${error.message}`);
  }
}

async function getChampionsByName(name) {
  try {
    const champion = await Champion.find({ name });
    return champion;
  } catch (error) {
    throw new Error(`Error fetching champion: ${error.message}`);
  }
}

async function getAllChampions() {
  try {
    const champions = await Champion.find({});
    return champions;
  } catch (error) {
    throw new Error(`Error fetching all champions: ${error.message}`);
  }
}

export const championsRepo = {
    saveToDb,
    getChampionsByName,
    getAllChampions
}