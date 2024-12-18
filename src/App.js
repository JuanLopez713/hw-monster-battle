import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonsterBattleUI from './components/MonsterBattleUI';
import BattleArena from './components/BattleArena';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MonsterBattleUI />} />
        <Route path="/battle" element={<BattleArena />} />
      </Routes>
    </Router>
  );
}

export default App;