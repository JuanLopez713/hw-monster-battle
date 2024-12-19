// battleConstants.js
export const STAT_CONSTRAINTS = {
    minValues: {
      health: 30,
      attack: 20,
      defense: 20,
      speed: 20
    },
    maxValues: {
      health: 255,
      attack: 200,
      defense: 200,
      speed: 180
    }
  };
  
  export const TYPE_EFFECTIVENESS = {
    FIRE: { EARTH: 1.3, WATER: 0.7 },
    WATER: { FIRE: 1.3, EARTH: 0.7 },
    EARTH: { AIR: 1.3, FIRE: 0.7 },
    AIR: { WATER: 1.3, EARTH: 0.7 },
    LIGHT: { DARK: 1.3, EARTH: 0.7 },
    DARK: { LIGHT: 1.3, AIR: 0.7 }
  };
  
  export const ENERGY_CONSTANTS = {
    BASE_GAIN: 15,
    MIN_REGULAR_COST: 20,
    MIN_SPECIAL_COST: 40,
    MAX_ENERGY: 100
  };
  
  export const BATTLE_TIMINGS = {
    TURN_START: 1500,
    ABILITY_USE: 1000,
    EFFECT_DISPLAY: 1000,
    ENERGY_GAIN: 1000,
    ABILITY_RESET: 2000
  };