import mongoose, { mongo } from "mongoose";

const ChampionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    position: {
      type: String,
      required: true,
      enum: ["TOP", "JGL", "MID", "ADC", "SPT", "UNK"],
    },
    picks: { type: Number, required: true },
    wins: { type: Number, required: true },
    pickRate: { type: Number, required: true },
    winRate: { type: Number, required: true },
    powerScore: { type: Number, required: true },
    tier: { type: String, required: true, enum: ["S", "A", "B", "C", "D"] },
    mostItems: { type: [Number], required: true },
    mostBoots: {type: [Number], required: true},
    mostSpellCombo: { type: [Number], required: true },
    mostRune: {
      type: {
        primaryStyle: { type: Number, required: true },
        subStyle: { type: Number, required: true },
        primarySelections: { type: [Number], required: true }, // List of numbers
        subSelections: { type: [Number], required: true }, // List of numbers
      },
      required: true,
    },
  },
  { timestamps: true }
);

export const Champion = mongoose.model("Champion", ChampionSchema);
