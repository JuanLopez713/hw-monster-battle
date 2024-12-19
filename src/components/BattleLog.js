import React, { useRef, useEffect } from 'react';

export const BattleLog = ({ logs }) => {
  const logContainerRef = useRef(null);
  
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]); // Scroll whenever logs array changes

  return (
    <div className="md:col-span-1 bg-gray-50 rounded p-4 h-96">
      <h3 className="font-bold mb-2 sticky top-0 bg-gray-50 py-2">Battle Log</h3>
      <div 
        ref={logContainerRef}
        className="space-y-2 overflow-y-auto h-[calc(100%-3rem)]"
      >
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={`p-2 rounded text-sm ${
              entry.type === 'attack' ? 'bg-red-100 text-red-800' :
              entry.type === 'critical' ? 'bg-yellow-100 text-yellow-800' :
              entry.type === 'effect' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
};