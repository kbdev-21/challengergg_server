import { AccountStats } from "../../models/AccountStats.js";

async function createIfEmpty(puuid) {
  try {
    const existing = await AccountStats.findOne({ puuid });
    if (!existing) {
      await AccountStats.create({ puuid: puuid });
      //console.log(`Created new AccountStats for puuid: ${puuid}`);
    } else {
      //console.log(`AccountStats already exists for puuid: ${puuid}`);
    }
  } catch (error) {
    throw error; // Optional: rethrow if you want higher-level handlers to deal with it
  }
}

async function addPerformances(puuid, performances) {
  try {
    await createIfEmpty(puuid);

    const accountStats = await AccountStats.findOne(
      { puuid },
      { performances: 1 }
    );
    const existingMatchIds = new Set(
      accountStats.performances.map((perf) => perf.matchId)
    );

    for (const performance of performances) {
      if (!existingMatchIds.has(performance.matchId)) {
        await AccountStats.updateOne(
          { puuid },
          { $push: { performances: performance } }
        );
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getAllPerformances(puuid) {
  try {
    await createIfEmpty(puuid);

    const accountStats = await AccountStats.findOne(
      { puuid },
      { performances: 1 }
    );
    return accountStats.performances;
  } catch (error) {
    throw error;
  }
}

async function updateChampStats(puuid, champStats) {
  try {
    await createIfEmpty(puuid);

    await AccountStats.updateOne({ puuid }, { $set: { champStats } });
    //console.log(`Updated champStats for puuid: ${puuid}`);
  } catch (error) {
    throw error;
  }
}

export const accountStatsRepo = {
  addPerformances,
  getAllPerformances,
  updateChampStats
};
