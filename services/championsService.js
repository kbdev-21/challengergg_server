import { Match } from "../models/Match.js";
import { Champion } from "../models/Champion.js";
import { championsRepo } from "../repositories/database/championsRepo.js";
import {
  calculateChampionPowerScore,
  calculateChampionTier,
} from "../utils/algorithm.js";
import { matchesRepo } from "../repositories/database/matchesRepo.js";

async function getChampionsByName(name) {
  try {
    const champs = await championsRepo.getChampionsByName(name);
    const sortedChamps = champs.sort((a, b) => b.pickRate - a.pickRate);
    return sortedChamps;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllChampions() {
  try {
    const champs = await championsRepo.getAllChampions();
    return champs;
  } catch (error) {}
}

async function calChampsStatsAndSaveToDb() {
  try {
    const matches = await matchesRepo.getAllMatches();
    const championsPicksCount = {};
    const championsWinsCount = {};
    let gamesCount = 0;
    // const champsEachPosition = {
    //   TOP: new Set(),
    //   JGL: new Set(),
    //   MID: new Set(),
    //   ADC: new Set(),
    //   SPT: new Set(),
    // };

    matches.forEach((match) => {
      if (
        match.gameMode === "RANKED_SOLO" ||
        match.gameMode === "RANKED_FLEX"
      ) {
        gamesCount++;
        match.players.forEach((player) => {
          if (player.position === "UNK") return;

          const champ = `${player.championName}-${player.position}`;

          // Count champion picks
          championsPicksCount[champ] = (championsPicksCount[champ] || 0) + 1;

          // Ensure the champion is initialized in win count
          if (!(champ in championsWinsCount)) {
            championsWinsCount[champ] = 0; // Initialize with 0 if first encounter
          }

          // Count champion wins (only if the player won)
          if (player.isWin) {
            championsWinsCount[champ] += 1;
          }

          // Track unique champions per position
          //champsEachPosition[player.position].add(player.championName);
        });
      }
    });

    //test
    // for (const [pos, champsSet] of Object.entries(champsEachPosition)) {
    //   console.log(`${pos}: ${champsSet.size} unique champions`);
    // }

    // **Use for...of instead of forEach to properly await the database save**
    for (const [champ, picks] of Object.entries(championsPicksCount)) {
      const code = champ;
      const name = code.split("-")[0];
      const position = code.split("-")[1];

      const wins = championsWinsCount[champ];
      const pickRate = parseFloat(((picks / gamesCount) * 100).toFixed(2));
      const winRate = parseFloat(((wins / picks) * 100).toFixed(2));

      const powerScore = calculateChampionPowerScore(pickRate, winRate);
      const tier = calculateChampionTier(powerScore);

      const champStats = new Champion({
        code: code,
        name: name,
        position: position,
        picks: picks,
        wins: wins,
        pickRate: pickRate,
        winRate: winRate,
        powerScore: powerScore,
        tier: tier,
      });

      await championsRepo.saveToDb(champStats);
    }
  } catch (error) {
    console.error("Error retrieving matches:", error);
  }
}

export const championsService = {
  calChampsStatsAndSaveToDb,
  getChampionsByName,
  getAllChampions,
};
