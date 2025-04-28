import { ChampStats } from "../models/AccountStats.js";
import { accountStatsRepo } from "../repositories/database/accountStatsRepo.js";

async function getAccountChampStatsByPuuid(puuid) {
  const perfs = await accountStatsRepo.getAllPerformances(puuid);
  const champStats = [];
  perfs.forEach((perf) => {
    const existingChampStat = champStats.find(
      (champ) => champ.championName === perf.championName
    );

    if (existingChampStat) {
      // Update the existing champ stats
      existingChampStat.games += 1;
      existingChampStat.kda += perf.kda;
      if (perf.isWin) {
        existingChampStat.wins += 1;
      } else {
        existingChampStat.losses += 1;
      }
    } else {
      const newChampStat = new ChampStats({
        championName: perf.championName,
        games: 1,
        wins: perf.isWin ? 1 : 0,
        losses: !perf.isWin ? 1 : 0,
        winRate: 0, // Placeholder, will calculate later
        avgKda: perf.kda,
      });
      champStats.push(newChampStat);
    }
  });

  // Calculate winRate and avgKda for each champion
  champStats.forEach((champStat) => {
    champStat.winRate = parseFloat(
      ((champStat.wins / champStat.games) * 100).toFixed(2)
    );
    champStat.avgKda = parseFloat((champStat.kda / champStat.games).toFixed(2));
  });

  champStats.sort((a, b) => {
    if (b.games !== a.games) {
      return b.games - a.games;
    }

    return b.winRate - a.winRate;
  });

  await accountStatsRepo.updateChampStats(puuid, champStats);

  return champStats;
}

export const accountStatsService = { getAccountChampStatsByPuuid };
