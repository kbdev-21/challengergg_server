import mongoose from "mongoose";

const RuneSchema = new mongoose.Schema({
  primaryStyle: { type: Number, required: true },
  subStyle: { type: Number, required: true },
  primarySelections: { type: [Number], required: true }, // List of numbers
  subSelections: { type: [Number], required: true }, // List of numbers
});

const PlayerSchema = new mongoose.Schema({
  puuid: { type: String, required: true },
  name: { type: String, required: true },
  tag: { type: String, required: true },
  teamId: { type: Number, required: true },
  isWin: { type: Boolean, required: true },
  position: { type: String, required: true },
  championName: { type: String, required: true },
  spell1Id: { type: Number, required: true },
  spell2Id: { type: Number, required: true },
  rune: { type: RuneSchema, required: true },
  championLevel: { type: Number, required: true },
  kills: { type: Number, required: true },
  deaths: { type: Number, required: true },
  assists: { type: Number, required: true },
  kda: { type: Number, required: true },
  totalGold: { type: Number, required: true },
  totalCs: { type: Number, required: true },
  totalDamageDealt: { type: Number, required: true },
  wardsPlaced: { type: Number, required: true },
  wardsKilled: { type: Number, required: true },
  item0: { type: Number, required: true },
  item1: { type: Number, required: true },
  item2: { type: Number, required: true },
  item3: { type: Number, required: true },
  item4: { type: Number, required: true },
  item5: { type: Number, required: true },
  item6: { type: Number, required: true },
  killParticipation: { type: Number, required: true },
  kbScore: { type: Number, required: true },
});

const MatchSchema = new mongoose.Schema(
  {
    matchId: { type: String, required: true, unique: true },
    players: { type: [PlayerSchema], required: true },
    gameDuration: { type: Number, required: true },
    gameVersion: { type: String, required: true },
    gameMode: { type: String, required: true },
    gameStartTimestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", MatchSchema);
export const Player = mongoose.model("Player", PlayerSchema);
export const Rune = mongoose.model("Rune", RuneSchema);