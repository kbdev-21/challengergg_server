import { Match, Player, Rune } from "../models/Match.js";
import {
  fetchMatchesHistoryIdsByPuuid,
  fetchMatchInfoByMatchId,
} from "../repositories/api/leagueApi.js";
import { matchesRepo } from "../repositories/database/matchesRepo.js";
import { calculateKbScore } from "../utils/algorithm.js";
import { gameModeMap, positionMap } from "../utils/maps.js";

async function getAndSaveMatchByMatchId(matchId) {
  try {
    const matchData = await fetchMatchInfoByMatchId(matchId);

    const match = new Match({
      matchId: matchId,
      gameVersion: matchData.info.gameVersion,
      gameDuration: matchData.info.gameDuration,
      gameStartTimestamp: matchData.info.gameStartTimestamp,
      gameMode: gameModeMap[matchData.info.queueId] || "NORMAL",
      players: [],
    });

    const playersPuuid = matchData.metadata.participants;

    // Define position order
    const positionOrder = { TOP: 1, JGL: 2, MID: 3, ADC: 4, SPT: 5, UNK: 6 };

    for (let i = 0; i < playersPuuid.length; i++) {
      const playerData = matchData.info.participants[i];

      const player = new Player({
        puuid: playersPuuid[i],
        name: playerData.riotIdGameName,
        tag: playerData.riotIdTagline,
        teamId: playerData.teamId,
        isWin: playerData.win,
        position: positionMap[playerData.teamPosition] || "UNK",
        championName: playerData.championName,
        spell1Id: playerData.summoner1Id,
        spell2Id: playerData.summoner2Id,
        championLevel: playerData.champLevel,
        kills: playerData.kills,
        deaths: playerData.deaths,
        assists: playerData.assists,
        kda: parseFloat(playerData.challenges.kda.toFixed(2)),
        killParticipation: parseFloat(
          (playerData.challenges.killParticipation || 0).toFixed(2)
        ),
        totalGold: playerData.goldEarned,
        totalCs:
          playerData.totalMinionsKilled + playerData.neutralMinionsKilled,
        totalDamageDealt: playerData.totalDamageDealtToChampions,
        wardsPlaced: playerData.wardsPlaced,
        wardsKilled: playerData.wardsKilled,
        item0: playerData.item0,
        item1: playerData.item1,
        item2: playerData.item2,
        item3: playerData.item3,
        item4: playerData.item4,
        item5: playerData.item5,
        item6: playerData.item6,
      });

      // Handling player's rune
      player.rune = new Rune({
        primaryStyle: playerData.perks.styles[0].style,
        subStyle: playerData.perks.styles[1].style,
        primarySelections: playerData.perks.styles[0].selections.map(
          (perk) => perk.perk
        ),
        subSelections: playerData.perks.styles[1].selections.map(
          (perk) => perk.perk
        ),
      });

      match.players.push(player);
    }

    // Group players by teamId
    const teamGroups = {
      100: match.players.filter((player) => player.teamId === 100),
      200: match.players.filter((player) => player.teamId === 200),
    };

    // Calculate kbScore for each player
    for (let i = 0; i < match.players.length; i++) {
      const player = match.players[i];

      const opponentTeamId = player.teamId === 100 ? 200 : 100;
      const opponent = teamGroups[opponentTeamId].find(
        (p) => p.position === player.position
      );

      const kp = parseFloat(player.killParticipation.toFixed(2));
      const deaths = player.deaths;
      const gameDurationMinutes = matchData.info.gameDuration / 60;
      const win = player.isWin;
      const gold = player.totalGold;
      const opponentGold = opponent ? opponent.totalGold : 0;
      const position = player.position;

      const kbScore = calculateKbScore(
        kp,
        deaths,
        gameDurationMinutes,
        win,
        gold,
        opponentGold,
        position
      );
      player.kbScore = kbScore;
    }

    // Sort players by teamId, then by position
    match.players.sort((a, b) => {
      if (a.teamId !== b.teamId) {
        return a.teamId - b.teamId;
      }
      return positionOrder[a.position] - positionOrder[b.position];
    });

    // save to database
    await matchesRepo.saveToDb(match);

    return match;
  } catch (error) {
    throw new Error(`Error fetching match data: ${error.message}`);
  }
}

async function getMatchesByPuuidOnDb(puuid, start, count, queueFilter) {
  try {
    const matchIds = await fetchMatchesHistoryIdsByPuuid(
      puuid,
      start,
      count,
      queueFilter
    );

    const matches = [];
    for (const matchId of matchIds) {
      const match = await getMatchFromDbOrApi(matchId);
      matches.push(match);
    }

    return matches;
  } catch (error) {
    throw new Error(`Error fetching matches: ${error.message}`);
  }
}

async function getMatchFromDbOrApi(matchId) {
  try {
    const match = await matchesRepo.findByMatchId(matchId);
    if (match) {
      //console.log("Has this match");
      return match;
    } else {
      //console.log("Doesn't have this match");
      const apiMatch = await getAndSaveMatchByMatchId(matchId);
      return apiMatch;
    }
  } catch (error) {
    console.error(`Failed to fetch match ${matchId}:`, error.message);
    return null;
  }
}

export const matchesService = {
  getAndSaveMatchByMatchId,
  getMatchesByPuuidOnDb,
};
