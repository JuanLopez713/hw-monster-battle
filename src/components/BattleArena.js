import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { BattleLog } from './BattleLog';
import { BattleArenaStage } from './BattleArenaStage';
import { MonsterSelection } from './MonsterSelection';
import BattleControls from './BattleControls';

const BattleArena = () => {
  const navigate = useNavigate();
  const [monsters, setMonsters] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([null, null]);
  const [battleLog, setBattleLog] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [isBattling, setIsBattling] = useState(false);
  const [fighterStates, setFighterStates] = useState({
    fighter1: { currentHealth: 0, maxHealth: 0, currentEnergy: 0, lastUsedAbility: null },
    fighter2: { currentHealth: 0, maxHealth: 0, currentEnergy: 0, lastUsedAbility: null }
  });
  const db = getFirestore();

  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsters = async () => {
    const monstersCollection = collection(db, 'monsters');
    const snapshot = await getDocs(monstersCollection);
    const monsterList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMonsters(monsterList);
  };

  const selectMonster = (monster, slot) => {
    const newSelected = [...selectedMonsters];
    newSelected[slot] = monster;
    setSelectedMonsters(newSelected);
  };

  const updateFighterState = (fighterKey, updates) => {
    setFighterStates(prev => ({
      ...prev,
      [fighterKey]: { ...prev[fighterKey], ...updates }
    }));
  };

  const addToLog = (text, type = 'info') => {
    const logEntry = {
      id: Date.now(),
      text,
      type
    };
    setBattleLog(prev => [...prev, logEntry]);
    addFloatingText(text, type === 'attack' || type === 'critical');
  };

  const addFloatingText = (text, isAttack = false) => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, text, isAttack }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 2000);
  };

  const updateWins = async (winner) => {
    const docRef = doc(db, 'monsters', winner.id);
    await updateDoc(docRef, {
      wins: (winner.wins || 0) + 1
    });
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateDamage = (attacker, defender, ability) => {
    const baseDamage = 5;
    const attackDefenseRatio = Math.pow(attacker.stats.attack / defender.stats.defense, 0.6);
    const powerScaling = ability.power / 100;
    
    // Type effectiveness
    const typeMultiplier = calculateTypeEffectiveness(ability.type, defender.type, defender.stats.defense);
    
    // Crit calculation
    const baseCritChance = 0.08;
    const hpRatio = attacker.currentHealth / attacker.stats.health;
    const desperation = (1 - hpRatio) * 0.10;
    const criticalChance = Math.min(baseCritChance + desperation, 0.20);
    const isCritical = Math.random() < criticalChance;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    // Additional factors
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

    return { damage, typeMultiplier, isCritical };
  };

  const calculateTypeEffectiveness = (attackType, defenderType, defenderDefense) => {
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

  const calculateEnergyCosts = (ability) => {
    const minRegularCost = 20;
    const minSpecialCost = 40;
    
    if (ability.type === 'regular') {
      return Math.max(minRegularCost, Math.floor((ability.power / 120) * 50));
    }
    return Math.max(minSpecialCost, Math.floor((ability.power / 200) * 90));
  };

  const calculateEnergyGain = (monster) => {
    const baseGain = 15;
    const speedPenalty = monster.stats.speed / 255 * 5;
    return Math.max(8, Math.floor(baseGain - speedPenalty));
  };

  const startBattle = async () => {
    if (!selectedMonsters[0] || !selectedMonsters[1]) return;
    setIsBattling(true);
    setBattleLog([]);

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
    addToLog(`Battle Start: ${fighters[0].monsterName} vs ${fighters[1].monsterName}!`, 'info');
    await sleep(2000);

    let turn = 1;
    while (fighters[0].currentHealth > 0 && fighters[1].currentHealth > 0) {
      addToLog(`Turn ${turn}`, 'info');
      await sleep(1500);

      for (let i = 0; i < 2; i++) {
        const attacker = fighters[i];
        const defender = fighters[1-i];
        const fighterKey = i === 0 ? 'fighter1' : 'fighter2';

        // Energy gain
        const energyGain = calculateEnergyGain(attacker);
        attacker.currentEnergy = Math.min(100, attacker.currentEnergy + energyGain);
        updateFighterState(fighterKey, { currentEnergy: attacker.currentEnergy });
        addToLog(`${attacker.monsterName} gains ${energyGain} energy!`, 'info');
        await sleep(1000);

        // Ability selection
        let ability = null;
        let abilityType = null;
        
        const specialCost = calculateEnergyCosts({ ...attacker.abilities.special, type: 'special' });
        const regularCost = calculateEnergyCosts({ ...attacker.abilities.regular, type: 'regular' });
        
        if (attacker.currentEnergy >= specialCost) {
          ability = attacker.abilities.special;
          abilityType = 'special';
        } else if (attacker.currentEnergy >= regularCost) {
          ability = attacker.abilities.regular;
          abilityType = 'regular';
        }

        if (ability) {
          // Attack execution
          const { damage, typeMultiplier, isCritical } = calculateDamage(attacker, defender, ability);
          defender.currentHealth = Math.max(0, defender.currentHealth - damage);
          attacker.currentEnergy -= calculateEnergyCosts({ ...ability, type: abilityType });

          updateFighterState(fighterKey, { 
            currentEnergy: attacker.currentEnergy,
            lastUsedAbility: abilityType
          });
          updateFighterState(i === 0 ? 'fighter2' : 'fighter1', { 
            currentHealth: defender.currentHealth 
          });

          // Battle feedback
          addToLog(`${attacker.monsterName} uses ${ability.name}!`, 'attack');
          await sleep(1000);

          if (typeMultiplier > 1) {
            addToLog("It's super effective!", 'effect');
            await sleep(1000);
          } else if (typeMultiplier < 1) {
            addToLog("It's not very effective...", 'effect');
            await sleep(1000);
          }

          if (isCritical) {
            addToLog("Critical hit!", 'critical');
            await sleep(1000);
          }

          addToLog(`Deals ${damage} damage!`, 'attack');
          await sleep(1000);

          setTimeout(() => {
            updateFighterState(fighterKey, { lastUsedAbility: null });
          }, 2000);
        } else {
          addToLog(`${attacker.monsterName} is charging energy...`, 'info');
          await sleep(1500);
        }

        if (defender.currentHealth <= 0) {
          addToLog(`${defender.monsterName} fainted!`, 'critical');
          await sleep(1500);
          addToLog(`${attacker.monsterName} wins!`, 'critical');
          await updateWins(attacker);
          setIsBattling(false);
          return;
        }
      }

      addToLog(`=== End of Turn ${turn} ===`, 'info');
      await sleep(1500);
      turn++;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back to Home
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonsterSelection
            title="Select First Monster"
            monsters={monsters}
            selectedMonsterId={selectedMonsters[0]?.id}
            onSelect={(monster) => selectMonster(monster, 0)}
          />

          <MonsterSelection
            title="Select Second Monster"
            monsters={monsters}
            selectedMonsterId={selectedMonsters[1]?.id}
            onSelect={(monster) => selectMonster(monster, 1)}
          />

          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <BattleControls 
              onStartBattle={startBattle}
              canStart={selectedMonsters[0] && selectedMonsters[1]}
              isBattling={isBattling}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BattleLog logs={battleLog} />
              <BattleArenaStage
                selectedMonsters={selectedMonsters}
                fighterStates={fighterStates}
                floatingTexts={floatingTexts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;