import React from 'react';
import { Sword } from 'lucide-react';

const StatusBars = ({ health, maxHealth, energy, maxEnergy = 100, isTopRight }) => (
  <div className={`absolute ${
    isTopRight 
      ? 'bottom-28 right-20'  // Moved inward from right
      : 'bottom-28 left-20'   // Moved inward from left
  } w-48`}>
    {/* Health Bar */}
    <div className="mb-2">
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${(health / maxHealth) * 100}%` }}
        />
      </div>
      <div className="text-sm text-center mt-1">
        {health}/{maxHealth}
      </div>
    </div>
    
    {/* Energy Bar */}
    <div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${(energy / maxEnergy) * 100}%` }}
        />
      </div>
      <div className="text-sm text-center mt-1">
        {energy}/{maxEnergy}
      </div>
    </div>
  </div>
);

const AbilityIcons = ({ abilities, currentEnergy, lastUsedAbility, isTopRight }) => (
  <div className={`absolute ${
    isTopRight 
      ? 'bottom-4 right-20'   // Moved inward from right
      : 'bottom-4 left-20'    // Moved inward from left
  } flex space-x-2`}>
    {Object.entries(abilities).map(([type, ability]) => {
      let status = 'gray';
      if (currentEnergy >= ability.energyCost) {
        status = 'green';
      }
      if (lastUsedAbility === type) {
        status = 'yellow';
      }

      return (
        <div 
          key={type}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            status === 'green' ? 'bg-green-500' :
            status === 'yellow' ? 'bg-yellow-500' :
            'bg-gray-400'
          }`}
          title={`${ability.name} (${ability.energyCost} energy)`}
        >
          <Sword className="text-white" size={24} />
        </div>
      );
    })}
  </div>
);

const MonsterIcon = ({ isTopRight, monsterName, type }) => (
  <div className={`absolute ${
    isTopRight 
      ? 'bottom-64 right-32'  // Moved inward from right
      : 'bottom-64 left-32'   // Moved inward from left
  } w-20 h-20 bg-gray-300 rounded-full flex flex-col items-center justify-center`}>
    <span className="text-3xl">🦁</span>
    {monsterName && (
      <div className="absolute -bottom-6 text-sm font-bold whitespace-nowrap">
        {monsterName}
      </div>
    )}
  </div>
);

const FloatingText = ({ floatingTexts }) => (
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
);

export const BattleArenaStage = ({ 
  selectedMonsters,
  fighterStates,
  floatingTexts
}) => {
  return (
    <div className="md:col-span-2 relative h-96 bg-gray-50 rounded p-4 overflow-hidden">
      {/* Monster 1 (Right side) */}
      <MonsterIcon 
        isTopRight={true} 
        monsterName={selectedMonsters[0]?.monsterName}
        type={selectedMonsters[0]?.type}
      />
      <StatusBars 
        health={fighterStates.fighter1.currentHealth}
        maxHealth={fighterStates.fighter1.maxHealth}
        energy={fighterStates.fighter1.currentEnergy}
        isTopRight={true}
      />
      {selectedMonsters[0] && (
        <AbilityIcons 
          abilities={selectedMonsters[0].abilities}
          currentEnergy={fighterStates.fighter1.currentEnergy}
          lastUsedAbility={fighterStates.fighter1.lastUsedAbility}
          isTopRight={true}
        />
      )}

      {/* Monster 2 (Left side) */}
      <MonsterIcon 
        isTopRight={false}
        monsterName={selectedMonsters[1]?.monsterName}
        type={selectedMonsters[1]?.type}
      />
      <StatusBars 
        health={fighterStates.fighter2.currentHealth}
        maxHealth={fighterStates.fighter2.maxHealth}
        energy={fighterStates.fighter2.currentEnergy}
        isTopRight={false}
      />
      {selectedMonsters[1] && (
        <AbilityIcons 
          abilities={selectedMonsters[1].abilities}
          currentEnergy={fighterStates.fighter2.currentEnergy}
          lastUsedAbility={fighterStates.fighter2.lastUsedAbility}
          isTopRight={false}
        />
      )}

      {/* Floating Text */}
      <FloatingText floatingTexts={floatingTexts} />
    </div>
  );
};