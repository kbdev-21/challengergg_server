import {
  fetchAccountInfoByPuuid,
  fetchPuuidByRiotId,
  fetchRankByPuuid,
  fetchRiotIdByPuuid,
} from "../repositories/api/leagueApi.js";
import { getRankPowerByRank } from "../utils/leagueUtils.js";
import { accountsRepo } from "../repositories/database/accountsRepo.js";
import { Account, Rank } from "../models/Account.js";

const queueMap = {
  RANKED_SOLO_5x5: "RANKED_SOLO",
  RANKED_FLEX_SR: "RANKED_FLEX",
};

async function getAccountByPuuid(puuid) {
  try {
    const riotIdData = await fetchRiotIdByPuuid(puuid);
    const infoData = await fetchAccountInfoByPuuid(puuid);
    const rankData = await fetchRankByPuuid(puuid);

    const accountRanks = rankData
      .map((rankInfo) =>
        new Rank({
          queue: queueMap[rankInfo.queueType],
          rank: `${rankInfo.tier} ${rankInfo.rank}`,
          leaguePoints: rankInfo.leaguePoints,
          power: getRankPowerByRank(
            rankInfo.tier,
            rankInfo.rank,
            rankInfo.leaguePoints
          ),
          wins: rankInfo.wins,
          losses: rankInfo.losses,     
        })
      )
      .sort((a, b) => b.power - a.power);

    const account = new Account({
      puuid: puuid,
      gameName: riotIdData.gameName,
      tagLine: riotIdData.tagLine,
      profileIconId: infoData.profileIconId,
      summonerLevel: infoData.summonerLevel,
      rank: accountRanks, // Include rank
    });

    await accountsRepo.saveToDb(account);

    return account;
  } catch (error) {
    throw new Error(`Error fetching account data: ${error.message}`);
  }
}

async function getAccountByRiotId(name, tag) {
  try {
    const puuidData = await fetchPuuidByRiotId(name, tag);
    const infoData = await fetchAccountInfoByPuuid(puuidData.puuid);
    const rankData = await fetchRankByPuuid(puuidData.puuid);

    const accountRanks = rankData
      .map((rankInfo) =>
        new Rank({
          queue: queueMap[rankInfo.queueType],
          rank: `${rankInfo.tier} ${rankInfo.rank}`,
          leaguePoints: rankInfo.leaguePoints,
          power: getRankPowerByRank(
            rankInfo.tier,
            rankInfo.rank,
            rankInfo.leaguePoints
          ),
          wins: rankInfo.wins,
          losses: rankInfo.losses,     
        })
      )
      .sort((a, b) => b.power - a.power);

    const account = new Account({
      puuid: puuidData.puuid,
      gameName: puuidData.gameName,
      tagLine: puuidData.tagLine,
      profileIconId: infoData.profileIconId,
      summonerLevel: infoData.summonerLevel,
      rank: accountRanks, // Include rank
    });

    await accountsRepo.saveToDb(account);

    return account;
  } catch (error) {
    throw new Error(`Error fetching account data: ${error.message}`);
  }
}

async function getSearchedAccountsBySearchKey(searchKey) {
  try {
    const searchedAccounts = accountsRepo.search(searchKey);
    return searchedAccounts;
  } catch (error) {
    next(error);
  }
}

export const accountsService = {
  getAccountByRiotId,
  getAccountByPuuid,
  getSearchedAccountsBySearchKey,
};
