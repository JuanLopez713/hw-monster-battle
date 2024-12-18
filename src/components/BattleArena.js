import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const BattleArena = () => {
  const navigate = useNavigate();
  const [monsters, setMonsters] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([null, null]);
  const [battleLog, setBattleLog] = useState([]);
  const [isBattling, setIsBattling] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
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

  const startBattle = async () => {
    if (!selectedMonsters[0] || !selectedMonsters[1]) return;
    setIsBattling(true);
    setBattleLog([]);

    // Clone monsters for battle
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

    // Randomly choose who goes first
    const fighters = Math.random() < 0.5 ? [monster1, monster2] : [monster2, monster1];
    
    addFloatingText(`Battle Start: ${fighters[0].monsterName} vs ${fighters[1].monsterName}!`);
    
    let turn = 1;
    const battleInterval = setInterval(async () => {
      for (let i = 0; i < 2; i++) {
        const attacker = fighters[i];
        const defender = fighters[1-i];
        
        if (!attacker.currentHealth || !defender.currentHealth) {
          clearInterval(battleInterval);
          const winner = attacker.currentHealth ? attacker : defender;
          addFloatingText(`${winner.monsterName} wins!`, true);
          await updateWins(winner);
          setIsBattling(false);
          return;
        }

        // Gain energy
        attacker.currentEnergy = Math.min(100, attacker.currentEnergy + 20);

        // Choose ability
        let ability = null;
        if (attacker.currentEnergy >= attacker.abilities.special.energyCost) {
          ability = attacker.abilities.special;
        } else if (attacker.currentEnergy >= attacker.abilities.regular.energyCost) {
          ability = attacker.abilities.regular;
        }

        if (ability) {
          const damage = Math.floor(
            (attacker.stats.attack * ability.power) / 100 * 
            (1 - defender.stats.defense / 255)
          );
          defender.currentHealth = Math.max(0, defender.currentHealth - damage);
          attacker.currentEnergy -= ability.energyCost;

          const logText = `${attacker.monsterName} uses ${ability.name} for ${damage} damage!`;
          setBattleLog(prev => [...prev, logText]);
          addFloatingText(logText, true);
        } else {
          const logText = `${attacker.monsterName} is charging energy...`;
          setBattleLog(prev => [...prev, logText]);
          addFloatingText(logText);
        }
      }
      turn++;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          ← Back to Home
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monster Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Select First Monster</h2>
            <div className="space-y-2">
              {monsters.map(monster => (
                <div
                  key={monster.id}
                  onClick={() => selectMonster(monster, 0)}
                  className={`p-3 rounded cursor-pointer ${
                    selectedMonsters[0]?.id === monster.id 
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{monster.monsterName}</div>
                  <div className="text-sm">Player: {monster.playerTag}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Select Second Monster</h2>
            <div className="space-y-2">
              {monsters.map(monster => (
                <div
                  key={monster.id}
                  onClick={() => selectMonster(monster, 1)}
                  className={`p-3 rounded cursor-pointer ${
                    selectedMonsters[1]?.id === monster.id 
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{monster.monsterName}</div>
                  <div className="text-sm">Player: {monster.playerTag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Arena */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <button
                onClick={startBattle}
                disabled={!selectedMonsters[0] || !selectedMonsters[1] || isBattling}
                className={`px-8 py-3 rounded-lg text-lg font-bold ${
                  !selectedMonsters[0] || !selectedMonsters[1] || isBattling
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Start Battle!
              </button>
            </div>

            {/* Battle Log */}
            <div className="relative h-96 bg-gray-50 rounded p-4 overflow-hidden">
              {/* Floating Text Container */}
              <div className="absolute inset-0 pointer-events-none">
                {floatingTexts.map(({ id, text, isAttack }) => (
                  <div
                    key={id}
                    className={`absolute left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg 
                      ${isAttack ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
                      animate-float`}
                    style={{
                      animation: 'float 2s ease-out forwards',
                      bottom: '20%'
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>

              {/* Battle Log */}
              <div className="h-full overflow-y-auto space-y-2">
                {battleLog.map((log, index) => (
                  <div key={index} className="text-sm">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;