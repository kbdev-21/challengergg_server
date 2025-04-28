import mongoose from "mongoose";

const ChampionSchema = new mongoose.Schema(
  {
    code: {type: String, required: true, unique: true},
    name: { type: String, required: true },
    position: {type: String, required: true, enum: ["TOP", "JGL", "MID", "ADC", "SPT", "UNK"]},
    picks: { type: Number, required: true },
    wins: { type: Number, required: true },
    pickRate: { type: Number, required: true },
    winRate: { type: Number, required: true },
    powerScore: { type: Number, required: true },
    tier: { type: String, required: true, enum: ["S", "A", "B", "C", "D"] },
  },
  { timestamps: true }
);

export const Champion = mongoose.model("Champion", ChampionSchema);
