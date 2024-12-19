// Components/MonsterSelection.js
import React from 'react';

export const MonsterSelection = ({ title, monsters, selectedMonsterId, onSelect }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="space-y-2">
      {monsters.map(monster => (
        <div
          key={monster.id}
          onClick={() => onSelect(monster)}
          className={`p-3 rounded cursor-pointer ${
            selectedMonsterId === monster.id 
              ? 'bg-blue-100 border-2 border-blue-500'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="font-bold">{monster.monsterName}</div>
          <div className="text-sm">Player: {monster.playerTag}</div>
          <div className="text-sm mt-1 grid grid-cols-2 gap-2">
            <div>HP: {monster.stats.health}</div>
            <div>ATK: {monster.stats.attack}</div>
            <div>DEF: {monster.stats.defense}</div>
            <div>SPD: {monster.stats.speed}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Components/BattleControls.js
export const BattleControls = ({ onStartBattle, canStart, isBattling }) => (
  <div className="text-center mb-4">
    <button
      onClick={onStartBattle}
      disabled={!canStart || isBattling}
      className={`px-8 py-3 rounded-lg text-lg font-bold ${
        !canStart || isBattling
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`}
    >
      Start Battle!
    </button>
  </div>
);

// Components/BackButton.js
export const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
  >
    ← Back to Home
  </button>
);