import { Match } from "../../models/Match.js";

async function saveToDb(match) {
  try {
    const updatedMatch = await Match.findOneAndUpdate(
      { matchId: match.matchId }, // Search by matchId
      {
        matchId: match.matchId,
        gameDuration: match.gameDuration,
        gameVersion: match.gameVersion,
        gameMode: match.gameMode,
        gameStartTimestamp: match.gameStartTimestamp,
        players: match.players, // Assuming 'players' is an array of PlayerDto or equivalent data
      },
      {
        upsert: true, // If match doesn't exist, create a new one
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run for the data
      }
    );
    return updatedMatch;
  } catch (error) {
    throw new Error(`Error saving or updating match: ${error.message}`);
  }
}

async function isExisted(matchId) {
  try {
    const exists = await Match.exists({ matchId: matchId });
    return exists ? true : false; // Return true if match exists, otherwise false
  } catch (error) {
    throw new Error(`Error checking match existence: ${error.message}`);
  }
}

async function findByMatchId(matchId) {
  try {
    const match = await Match.findOne({matchId: matchId});
    return match;
  } catch (error) {
    throw new Error(`Error fetching match data: ${error.message}`);
  }
}

export const matchesRepo = {
  isExisted,
  saveToDb,
  findByMatchId
};
