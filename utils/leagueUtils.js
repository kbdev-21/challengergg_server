export function getRankPowerByRank(tier, division, points) {
  const powerMap = new Map();
  powerMap.set("IRON", 0);
  powerMap.set("BRONZE", 400);
  powerMap.set("SILVER", 800);
  powerMap.set("GOLD", 1200);
  powerMap.set("PLATINUM", 1600);
  powerMap.set("EMERALD", 2000);
  powerMap.set("DIAMOND", 2400);
  powerMap.set("MASTER", 2800);
  powerMap.set("GRANDMASTER", 2800);
  powerMap.set("CHALLENGER", 2800);

  powerMap.set("IV", 0);
  powerMap.set("III", 100);
  powerMap.set("II", 200);
  powerMap.set("I", 300);

  if(['CHALLENGER', 'GRANDMASTER', 'MASTER'].includes(tier)) {
    return 0 + powerMap.get(tier) + points;
  }

  return 0 + powerMap.get(tier) + powerMap.get(division) + points;
}
