export function calculateKbScore(
  kp,
  deaths,
  gameDurationMinutes,
  isWin,
  gold,
  opponentGold,
  position
) {
  const dp10m = (deaths / gameDurationMinutes) * 10;

  const defaultAttrWeight = 5.0;
  const kpAttrWeight = 50.0;
  const winAttrWeight = 10.0;
  const deathsAttrWeight = 25.0;
  const goldLeadAttrWeight = 10.0;

  let defaultAttr = defaultAttrWeight;

  let kpAttr = (kp / 0.8) * kpAttrWeight;
  if (kpAttr > kpAttrWeight) kpAttr = kpAttrWeight;

  let winAttr = isWin ? winAttrWeight : 0;

  let deathsAttr = ((11.665 - dp10m * 3.33) / 10) * deathsAttrWeight;
  if (deathsAttr > deathsAttrWeight) deathsAttr = deathsAttrWeight;
  if (deathsAttr < -10) deathsAttr = -10;

  let goldLeadAttr =
    goldLeadAttrWeight / 2 +
    (((gold - opponentGold) / 4000) * goldLeadAttrWeight) / 2;
  if (goldLeadAttr > goldLeadAttrWeight) goldLeadAttr = goldLeadAttrWeight;
  if (goldLeadAttr < 0) goldLeadAttr = 0;
  if (position === "SPT") goldLeadAttr = goldLeadAttrWeight / 2;

  const finalScore = Math.round(
    kpAttr + winAttr + deathsAttr + defaultAttr + goldLeadAttr
  );

  return finalScore;
}

export function calculateChampionPowerScore(pickRate, winRate) {
  let pickScore = pickRate;
  if(pickScore > 10) pickScore = 10;
  if(pickScore < 0) pickScore = 0;

  let winScore = winRate - 45;
  if(winScore > 10) winScore = 10;
  if(winScore < 0) winScore = 0;

  const powerScore = (winScore/10)*65 + (pickScore/10)*35;
  return Math.round(powerScore);
}

export function calculateChampionTier(powerScore) {
  let tier = "D";
  if (powerScore >= 20) {
    tier = "C";
  }
  if (powerScore >= 40) {
    tier = "B";
  }
  if (powerScore >= 60) {
    tier = "A";
  }
  if (powerScore >= 80) {
    tier = "S";
  }
  return tier;
}
