import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCFe3QEBX6sPqrRaPLBNxNfejbxm1HBgfg",

  authDomain: "hw-monster-battle.firebaseapp.com",

  projectId: "hw-monster-battle",

  storageBucket: "hw-monster-battle.firebasestorage.app",

  messagingSenderId: "806524011519",

  appId: "1:806524011519:web:181b4fb6d478c052385dca",

  measurementId: "G-CTS7HB4N55"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MonsterBattleUI = () => {
  const navigate = useNavigate();
  const [monsters, setMonsters] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  const [isBattling, setIsBattling] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    playerTag: '',
    monsterName: '',
    type: 'FIRE',
    health: '',  // Changed from 0 to empty string
    attack: '',  // Changed from 0 to empty string
    defense: '', // Changed from 0 to empty string
    speed: '',   // Changed from 0 to empty string
    regularAbilityName: '',
    regularAbilityPower: '',  // Changed from 0 to empty string
    specialAbilityName: '',
    specialAbilityPower: ''   // Changed from 0 to empty string
  });

  useEffect(() => {
    loadMonsters();
  }, []);

   // Calculate total stats
   const totalStats = () => {
    const health = parseInt(formData.health) || 0;
    const attack = parseInt(formData.attack) || 0;
    const defense = parseInt(formData.defense) || 0;
    const speed = parseInt(formData.speed) || 0;
    return health + attack + defense + speed;
  };

   // Calculate energy costs
   const calculateEnergyCosts = () => {
    const regularCost = Math.floor((parseInt(formData.regularAbilityPower) || 0) / 4);
    const specialCost = Math.floor((parseInt(formData.specialAbilityPower) || 0) / 2);
    return { regularCost, specialCost };
  };

  

  const loadMonsters = async () => {
    try {
      const monstersCollection = collection(db, 'monsters');
      const monsterSnapshot = await getDocs(monstersCollection);
      const monsterList = monsterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMonsters(monsterList);
    } catch (error) {
      setMessage('Error loading monsters: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['health', 'attack', 'defense', 'speed', 'regularAbilityPower', 'specialAbilityPower'].includes(name)) {
      // Remove leading zeros
      const processedValue = value.replace(/^0+/, '');
      // Only update if it's empty or a valid number
      if (processedValue === '' || /^\d+$/.test(processedValue)) {
        setFormData(prev => ({
          ...prev,
          [name]: processedValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    // Validate player tag (3 letters)
    if (!/^[A-Za-z]{3}$/.test(formData.playerTag)) {
      setMessage('Player tag must be exactly 3 letters');
      return false;
    }
  
    // Parse stats as integers and calculate total
    const stats = {
      health: parseInt(formData.health) || 0,
      attack: parseInt(formData.attack) || 0,
      defense: parseInt(formData.defense) || 0,
      speed: parseInt(formData.speed) || 0
    };
    
    const totalStats = stats.health + stats.attack + stats.defense + stats.speed;
    
    if (totalStats !== 255) {
      setMessage('Total stats must equal 255 (currently: ' + totalStats + ')');
      return false;
    }
  
    // Validate ability powers
    const regularPower = parseInt(formData.regularAbilityPower) || 0;
    const specialPower = parseInt(formData.specialAbilityPower) || 0;
  
    if (regularPower > 120) {
      setMessage('Regular ability power cannot exceed 120');
      return false;
    }
    if (specialPower > 200) {
      setMessage('Special ability power cannot exceed 200');
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      await addDoc(collection(db, 'monsters'), {
        playerTag: formData.playerTag.toUpperCase(),
        monsterName: formData.monsterName,
        type: formData.type,
        stats: {
          health: parseInt(formData.health) || 0,
          attack: parseInt(formData.attack) || 0,
          defense: parseInt(formData.defense) || 0,
          speed: parseInt(formData.speed) || 0
        },
        abilities: {
          regular: {
            name: formData.regularAbilityName,
            power: parseInt(formData.regularAbilityPower) || 0,
            energyCost: Math.floor((parseInt(formData.regularAbilityPower) || 0) / 4)
          },
          special: {
            name: formData.specialAbilityName,
            power: parseInt(formData.specialAbilityPower) || 0,
            energyCost: Math.floor((parseInt(formData.specialAbilityPower) || 0) / 2)
          }
        },
        createdAt: new Date().toISOString()
      });
  
      setMessage('Monster created successfully!');
      loadMonsters();
      
      // Reset form
      setFormData({
        playerTag: '',
        monsterName: '',
        type: 'FIRE',
        health: '',
        attack: '',
        defense: '',
        speed: '',
        regularAbilityName: '',
        regularAbilityPower: '',
        specialAbilityName: '',
        specialAbilityPower: ''
      });
    } catch (error) {
      setMessage('Error creating monster: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monster Battle Arena</h1>
          <p className="text-gray-600">Create your monster and battle against others!</p>
          <button
            onClick={() => navigate('/battle')}
            className="mt-4 px-8 py-3 bg-red-600 text-white rounded-lg text-lg font-bold hover:bg-red-700 transform hover:scale-105 transition-all"
          >
            BATTLE!
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monster Creation Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Create Monster</h2>

              {/* Stats Total Display */}
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Stats:</span>
              <span className={`font-bold ${totalStats() === 255 ? 'text-green-600' : 'text-red-600'}`}>
                {totalStats()}/255
              </span>
            </div>
          </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Player Tag (3 letters)</label>
                  <input
                    type="text"
                    name="playerTag"
                    maxLength="3"
                    value={formData.playerTag}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monster Name</label>
                  <input
                    type="text"
                    name="monsterName"
                    value={formData.monsterName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="FIRE">Fire</option>
                  <option value="WATER">Water</option>
                  <option value="EARTH">Earth</option>
                  <option value="AIR">Air</option>
                  <option value="LIGHT">Light</option>
                  <option value="DARK">Dark</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Health</label>
                  <input
                    type="number"
                    name="health"
                    value={formData.health}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attack</label>
                  <input
                    type="number"
                    name="attack"
                    value={formData.attack}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Defense</label>
                  <input
                    type="number"
                    name="defense"
                    value={formData.defense}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Speed</label>
                  <input
                    type="number"
                    name="speed"
                    value={formData.speed}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Regular Ability Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Regular Ability Name</label>
                <input
                  type="text"
                  name="regularAbilityName"
                  value={formData.regularAbilityName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Regular Ability Power 
                  {formData.regularAbilityPower && 
                    <span className="text-gray-500 text-xs ml-2">
                      (Energy Cost: {calculateEnergyCosts().regularCost})
                    </span>
                  }
                </label>
                <input
                  type="number"
                  name="regularAbilityPower"
                  value={formData.regularAbilityPower}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="120"
                />
              </div>
            </div>


              {/* Special Ability Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Special Ability Name</label>
                <input
                  type="text"
                  name="specialAbilityName"
                  value={formData.specialAbilityName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Special Ability Power
                  {formData.specialAbilityPower && 
                    <span className="text-gray-500 text-xs ml-2">
                      (Energy Cost: {calculateEnergyCosts().specialCost})
                    </span>
                  }
                </label>
                <input
                  type="number"
                  name="specialAbilityPower"
                  value={formData.specialAbilityPower}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="200"
                />
              </div>
            </div>

              {message && (
                <div className="p-3 bg-blue-50 text-blue-700 rounded">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Monster
              </button>
            </form>
          </div>

          {/* Monster List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Available Monsters</h2>
            <div className="space-y-4">
              {monsters.map(monster => (
                <div key={monster.id} className="p-4 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{monster.monsterName}</h3>
                      <p className="text-sm text-gray-600">Player: {monster.playerTag}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">{monster.type}</span>
                    <div className="mt-1 text-sm text-green-600 font-bold">
                      Wins: {monster.wins || 0}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>HP: {monster.stats.health}</div>
                    <div>ATK: {monster.stats.attack}</div>
                    <div>DEF: {monster.stats.defense}</div>
                    <div>SPD: {monster.stats.speed}</div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>Regular: {monster.abilities.regular.name} ({monster.abilities.regular.power} PWR)</div>
                    <div>Special: {monster.abilities.special.name} ({monster.abilities.special.power} PWR)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterBattleUI;