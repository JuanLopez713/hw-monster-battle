// MonsterList.js
export const MonsterList = ({ 
    title, 
    monsters, 
    selectedMonsterId, 
    onSelect 
  }) => {
    return (
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
            </div>
          ))}
        </div>
      </div>
    );
  };