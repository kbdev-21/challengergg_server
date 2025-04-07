import axios from "axios";
import { gameModeToIdMap } from "../../utils/maps.js";

const apiKey = process.env.RIOT_API_KEY;

export async function fetchPuuidByRiotId(gameName, tagLine) {
  try {
    const baseUrl =
      "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";
    const res = await axios.get(
      `${baseUrl}${gameName}/${tagLine}?api_key=${apiKey}`
    );
    //console.log('Riot API called');
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAccountInfoByPuuid(puuid) {
  try {
    const baseUrl =
      "https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/";
    const res = await axios.get(`${baseUrl}${puuid}?api_key=${apiKey}`);
    //console.log('Riot API called');
    return res.data;
  } catch (error) {
    throw error;
  }
}

//filter: all, solo, flex
export async function fetchMatchesHistoryIdsByPuuid(
  puuid,
  start,
  count,
  filter
) {
  try {
    const baseUrl =
      "https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/";
    if (filter === "all") {
      const res = await axios.get(
        `${baseUrl}${puuid}/ids?start=${start}&count=${count}&api_key=${apiKey}`
      );
      return res.data;
    } else {
      const res = await axios.get(
        `${baseUrl}${puuid}/ids?queue=${gameModeToIdMap[filter]}&start=${start}&count=${count}&api_key=${apiKey}`
      );
      //console.log('Riot API called');
      return res.data;
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchMatchInfoByMatchId(matchId) {
  try {
    const baseUrl = "https://sea.api.riotgames.com/lol/match/v5/matches/";
    const res = await axios.get(`${baseUrl}${matchId}?api_key=${apiKey}`);
    //console.log('Riot API called');
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchRankByPuuid(puuid) {
  try {
    const baseUrl =
      "https://vn2.api.riotgames.com/lol/league/v4/entries/by-puuid/";
    const res = await axios.get(`${baseUrl}${puuid}?api_key=${apiKey}`);
    //console.log('Riot API called');
    return res.data;
  } catch (error) {
    throw error;
  }
}

//queueId: solo, flex
//rank: c, gm, m
export async function fetchRankedPlayersByRankAndQueueId(rank, queueId) {
  const rankMap = {'c': 'challengerleagues', 'gm': 'grandmasterleagues', 'm': 'masterleagues'};
  const queueIdMap = {'solo': 'RANKED_SOLO_5x5', 'flex': 'RANKED_FLEX_SR'};
//https://vn2.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key=RGAPI-3d8262d0-1ce2-40b5-9791-a331fee671e2
  try {
    const baseUrl =
      `https://vn2.api.riotgames.com/lol/league/v4/${rankMap[rank]}/by-queue/${queueIdMap[queueId]}?api_key=${apiKey}`;
    const res = await axios.get(baseUrl);
    //console.log('Riot API called');
    return res.data.entries;
  } catch (error) {
    throw error;
  }
}