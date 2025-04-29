import cron from "node-cron";
import { championsService } from "../services/championsService.js";
import { fetchRankedPlayersByRankAndQueueId } from "../repositories/api/leagueApi.js";
import { matchesService } from "../services/matchesService.js";

//fetch matches stats: every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Start fetching matches...");
  try {
    const intToRankMap = { 0: "c", 1: "gm", 2: "m" };
    const randInt = Math.floor(Math.random() * 3);
    const fetchedPlayers = await fetchRankedPlayersByRankAndQueueId(
      intToRankMap[randInt],
      "solo"
    );
    const selectedPuuids = [];
    let matchesCount = 0;
    //fetch matches of 3 players
    for (let i = 0; i < 3; i++) {
      const randIndex = Math.floor(Math.random() * fetchedPlayers.length);
      //console.log(fetchedPlayers[randIndex].puuid);
      selectedPuuids.push(fetchedPlayers[randIndex].puuid);
    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (const puuid of selectedPuuids) {
      await delay(100);
      try {
        const matches = await matchesService.getMatchesByPuuidOnDb(
          puuid,
          0,
          20,
          "solo"
        );
        matchesCount += matches.length;
      } catch (error) {
        console.error(error);
      }
    }
    console.log(`Fetched ${matchesCount} matches (${intToRankMap[randInt]}), saved to database!`);
  } catch (error) {
    console.error(error);
  }
});

//calculate matches stats: every 60 minutes
cron.schedule("*/60 * * * *", async () => {
  console.log("Start calculating champions' stats...");
  try {
    await championsService.calChampsStatsAndSaveToDb();
    console.log("Finished the calculation, saved to database!");
  } catch (error) {
    console.error(error);
  }
});
