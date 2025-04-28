import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  isWin: { type: Boolean, required: true },
  championName: { type: String, required: true },
  position: { type: String, required: true, enum: ["TOP", "JGL", "MID", "ADC", "SPT", "UNK"]},
  kda: { type: Number, required: true },
  gameVersion: { type: String, required: true },
  gameMode: { type: String, required: true }
}); 

const champStatsSchema = new mongoose.Schema({
  championName: { type: String, required: true },
  games: { type: Number, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
  winRate: { type: Number, required: true},
  avgKda: { type: Number, required: true },
});

const accountStatsSchema = new mongoose.Schema({
  puuid: { type: String, required: true, unique: true },
  performances: { type: [performanceSchema], default: [] },
  champStats: { type: [champStatsSchema], default: [] },
}, {
  timestamps: true, 
});

// Create and export the model
export const AccountStats = mongoose.model('AccountStats', accountStatsSchema);
export const Performance = mongoose.model('Performance', performanceSchema);
export const ChampStats = mongoose.model('ChampStats', champStatsSchema);