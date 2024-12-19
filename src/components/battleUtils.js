import { STAT_CONSTRAINTS } from './battleConstants';

export const calculateDamage = (attacker, defender, ability) => {
  const baseDamage = 5;
  const attackDefenseRatio = Math.pow(attacker.stats.attack / defender.stats.defense, 0.6);
  const powerScaling = ability.power / 100;
  
  const typeMultiplier = calculateTypeEffectiveness(ability.type, defender.type, defender.stats.defense);
  
  const { isCritical, criticalMultiplier } = calculateCritical(attacker, defender);
  const randomFactor = 0.9 + Math.random() * 0.2;
  const highHpBonus = defender.currentHealth > defender.stats.health * 0.75 ? 0.9 : 1;

  let damage = Math.floor(
    (baseDamage + (attackDefenseRatio * powerScaling * 80)) *
    typeMultiplier *
    criticalMultiplier *
    randomFactor *
    highHpBonus
  );

  damage = Math.max(1, damage);

  return { 
    damage, 
    typeMultiplier, 
    isCritical,
    attackDefenseRatio 
  };
};

export const calculateTypeEffectiveness = (attackType, defenderType, defenderDefense) => {
  const effectiveness = {
    FIRE: { EARTH: 1.3, WATER: 0.7 },
    WATER: { FIRE: 1.3, EARTH: 0.7 },
    EARTH: { AIR: 1.3, FIRE: 0.7 },
    AIR: { WATER: 1.3, EARTH: 0.7 },
    LIGHT: { DARK: 1.3, EARTH: 0.7 },
    DARK: { LIGHT: 1.3, AIR: 0.7 }
  };
  
  const defenseBonus = defenderDefense > 150 ? 0.9 : 1;
  return (effectiveness[attackType]?.[defenderType] || 1) * defenseBonus;
};

export const calculateCritical = (attacker, defender) => {
  const baseCritChance = 0.08;
  const hpRatio = attacker.currentHealth / attacker.stats.health;
  const desperation = (1 - hpRatio) * 0.10;
  
  const finalCritChance = Math.min(baseCritChance + desperation, 0.20);
  const isCritical = Math.random() < finalCritChance;

  return {
    isCritical,
    criticalMultiplier: isCritical ? 1.5 : 1
  };
};

export const calculateEnergyGain = (monster) => {
  const baseGain = 15;
  const speedPenalty = monster.stats.speed / 255 * 5;
  return Math.max(8, Math.floor(baseGain - speedPenalty));
};

export const calculateEnergyCosts = (ability) => {
  const minRegularCost = 20;
  const minSpecialCost = 40;
  
  if (ability.type === 'regular') {
    return Math.max(minRegularCost, Math.floor((ability.power / 120) * 50));
  }
  return Math.max(minSpecialCost, Math.floor((ability.power / 200) * 90));
};

export const validateStats = (stats) => {
  const totalStats = 255;
  const maxTwoStatTotal = totalStats * 0.6;

  // Check min/max values
  const validValues = Object.entries(stats).every(([stat, value]) => 
    value >= STAT_CONSTRAINTS.minValues[stat] && 
    value <= STAT_CONSTRAINTS.maxValues[stat]
  );

  // Check two-stat combinations
  const validCombinations = (
    stats.attack + stats.speed <= maxTwoStatTotal &&
    stats.attack + stats.defense <= maxTwoStatTotal &&
    stats.speed + stats.defense <= maxTwoStatTotal
  );

  return validValues && validCombinations;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));