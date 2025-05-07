import mongoose from "mongoose";

const RankSchema = new mongoose.Schema({
  queue: { type: String, required: true, enum: ["RANKED_SOLO", "RANKED_FLEX"] },
  rank: { type: String, required: true },
  leaguePoints: { type: Number, required: true },
  power: { type: Number, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
});

const AccountSchema = new mongoose.Schema(
  {
    puuid: { type: String, required: true, unique: true },
    gameName: { type: String, required: true },
    tagLine: { type: String, required: true },
    profileIconId: { type: Number, required: true },
    summonerLevel: { type: Number, required: true },
    rank: { type: [RankSchema], required: true },
    normalizedName: {type: String, required: true, index: true}
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", AccountSchema);
export const Rank = mongoose.model("Rank", RankSchema);