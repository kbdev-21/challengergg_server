import { Match } from "../models/Match.js";
import { Champion } from "../models/Champion.js";
import { championsRepo } from "../repositories/database/championsRepo.js";
import {
  calculateChampionPowerScore,
  calculateChampionTier,
} from "../utils/algorithm.js";
import { matchesRepo } from "../repositories/database/matchesRepo.js";
import _ from "lodash";
import {
  BASE_ITEM_IDS,
  BOOT_ITEM_IDS,
  START_ITEM_IDS,
  UTILITY_ITEM_IDS,
} from "../utils/maps.js";

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
    const dataMap = {};
    let gamesCount = 0;

    matches.forEach((match) => {
      if (
        match.gameMode === "RANKED_SOLO" ||
        match.gameMode === "RANKED_FLEX"
      ) {
        gamesCount++;
        match.players.forEach((player) => {
          if (player.position === "UNK") return;

          const champKey = `${player.championName}-${player.position}`;

          championsPicksCount[champKey] =
            (championsPicksCount[champKey] || 0) + 1;
          if (player.isWin) {
            championsWinsCount[champKey] =
              (championsWinsCount[champKey] || 0) + 1;
          }

          if (!dataMap[champKey]) {
            dataMap[champKey] = {
              items: [],
              spellCombos: [],
              runes: [],
              boots: [],
            };
          }

          // Collect all individual items (item0 - item6)
          const items = [
            player.item0,
            player.item1,
            player.item2,
            player.item3,
            player.item4,
            player.item5,
            player.item6,
          ];
          items.forEach((item) => {
            if (
              item == 0 ||
              UTILITY_ITEM_IDS.includes(item) ||
              BASE_ITEM_IDS.includes(item) ||
              START_ITEM_IDS.includes(item)
            ) {
              return;
            }

            if (BOOT_ITEM_IDS.includes(item)) {
              dataMap[champKey].boots.push(item);
            } else {
              dataMap[champKey].items.push(item);
            }
          });

          // Record spell combo (always as [min, max] to avoid flipped duplicates)
          const spellCombo = [player.spell1Id, player.spell2Id]
            .sort((a, b) => a - b)
            .join(",");
          dataMap[champKey].spellCombos.push(spellCombo);

          // Record rune setup as string to identify duplicates
          const runeKey = JSON.stringify({
            primaryStyle: player.rune.primaryStyle,
            subStyle: player.rune.subStyle,
            primarySelections: player.rune.primarySelections,
            subSelections: player.rune.subSelections,
          });
          dataMap[champKey].runes.push(runeKey);
        });
      }
    });

    // Process and save champion stats
    for (const [champKey, picks] of Object.entries(championsPicksCount)) {
      const name = champKey.split("-")[0];
      const position = champKey.split("-")[1];
      const wins = championsWinsCount[champKey];
      const pickRate = parseFloat(((picks / gamesCount) * 100).toFixed(2));
      const winRate = parseFloat(((wins / picks) * 100).toFixed(2));
      const powerScore = calculateChampionPowerScore(pickRate, winRate);
      const tier = calculateChampionTier(powerScore);
      const champData = dataMap[champKey];

      // === Calculate mostItems ===
      const itemFrequency = _.countBy(champData.items);
      const mostItems = Object.entries(itemFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([itemId]) => parseInt(itemId));

      // === Calculate mostBoots ===
      const bootFrequency = _.countBy(champData.boots);
      const mostBoots = Object.entries(bootFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([itemId]) => parseInt(itemId));

      // === Calculate mostSpellCombo ===
      const spellFrequency = _.countBy(champData.spellCombos);
      const mostSpellCombo = Object.entries(spellFrequency)
        .sort((a, b) => b[1] - a[1])[0][0]
        .split(",")
        .map(Number);

      // === Calculate mostRune ===
      const runeFrequency = _.countBy(champData.runes);
      const mostRuneKey = Object.entries(runeFrequency).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      const mostRune = JSON.parse(mostRuneKey);

      const champStats = new Champion({
        code: champKey,
        name,
        position,
        picks,
        wins,
        pickRate,
        winRate,
        powerScore,
        tier,
        mostItems,
        mostSpellCombo,
        mostRune,
        mostBoots,
      });

      await championsRepo.saveToDb(champStats);
    }
  } catch (error) {
    console.error("Error calculating champion stats:", error);
  }
}

// async function calChampsStatsAndSaveToDb() {
//   try {
//     const matches = await matchesRepo.getAllMatches();
//     const championsPicksCount = {};
//     const championsWinsCount = {};
//     let gamesCount = 0;

//     matches.forEach((match) => {
//       if (
//         match.gameMode === "RANKED_SOLO" ||
//         match.gameMode === "RANKED_FLEX"
//       ) {
//         gamesCount++;
//         match.players.forEach((player) => {
//           if (player.position === "UNK") return;

//           const champ = `${player.championName}-${player.position}`;

//           // Count champion picks and wins
//           championsPicksCount[champ] = (championsPicksCount[champ] || 0) + 1;
//           if (player.isWin) {
//             championsWinsCount[champ] = (championsWinsCount[champ] || 0) + 1;
//           }
//         });
//       }
//     });

//     // **Use for...of instead of forEach to properly await the database save**
//     for (const [champ, picks] of Object.entries(championsPicksCount)) {
//       const code = champ;
//       const name = code.split("-")[0];
//       const position = code.split("-")[1];

//       const wins = championsWinsCount[champ];
//       const pickRate = parseFloat(((picks / gamesCount) * 100).toFixed(2));
//       const winRate = parseFloat(((wins / picks) * 100).toFixed(2));

//       const powerScore = calculateChampionPowerScore(pickRate, winRate);
//       const tier = calculateChampionTier(powerScore);

//       const champStats = new Champion({
//         code: code,
//         name: name,
//         position: position,
//         picks: picks,
//         wins: wins,
//         pickRate: pickRate,
//         winRate: winRate,
//         powerScore: powerScore,
//         tier: tier,
//       });

//       await championsRepo.saveToDb(champStats);
//     }
//   } catch (error) {
//     console.error("Error retrieving matches:", error);
//   }
// }

export const championsService = {
  calChampsStatsAndSaveToDb,
  getChampionsByName,
  getAllChampions,
};
