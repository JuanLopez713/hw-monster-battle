// hooks/useBattle.js
import { useState } from 'react';
import { 
  calculateDamage, 
  calculateEnergyGain, 
  calculateEnergyCosts,
  validateStats,
  sleep 
} from '../battleUtils';
import { BATTLE_TIMINGS } from '../battleConstants';

export const useBattle = (selectedMonsters, setFighterStates, addToLog) => {
  const [isBattling, setIsBattling] = useState(false);

  const startBattle = async () => {
    if (!selectedMonsters[0] || !selectedMonsters[1]) return;
    
    // Validate both monsters before battle
    if (!validateStats(selectedMonsters[0].stats) || !validateStats(selectedMonsters[1].stats)) {
      addToLog("Invalid monster stats detected! Battle cancelled.", "critical");
      return;
    }

    setIsBattling(true);

    const monster1 = {
      ...selectedMonsters[0],
      currentHealth: selectedMonsters[0].stats.health,
      currentEnergy: 0
    };
    const monster2 = {
      ...selectedMonsters[1],
      currentHealth: selectedMonsters[1].stats.health,
      currentEnergy: 0
    };

    setFighterStates({
      fighter1: {
        currentHealth: monster1.stats.health,
        maxHealth: monster1.stats.health,
        currentEnergy: 0,
        lastUsedAbility: null
      },
      fighter2: {
        currentHealth: monster2.stats.health,
        maxHealth: monster2.stats.health,
        currentEnergy: 0,
        lastUsedAbility: null
      }
    });

    const fighters = Math.random() < 0.5 ? [monster1, monster2] : [monster2, monster1];
    await executeBattle(fighters);
  };

  const executeBattle = async (fighters) => {
    addToLog(`Battle Start: ${fighters[0].monsterName} vs ${fighters[1].monsterName}!`, 'info');
    await sleep(BATTLE_TIMINGS.TURN_START);

    let turn = 1;
    while (fighters[0].currentHealth > 0 && fighters[1].currentHealth > 0) {
      await executeTurn(fighters, turn);
      turn++;
    }

    setIsBattling(false);
  };

  const executeTurn = async (fighters, turn) => {
    // Turn execution logic here
    // ...similar to the battle logic in the main component
  };

  return { isBattling, startBattle };
};