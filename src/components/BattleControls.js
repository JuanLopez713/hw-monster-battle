// BattleControls.js
import React from 'react';

const BattleControls = ({ onStartBattle, canStart, isBattling }) => (
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

export default BattleControls;