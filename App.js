import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [data, setData] = useState(null);

  const fetchSensorData = () => {
    fetch('http://localhost:5000/api/sensors')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(err => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">Connecting to IoT Gateway...</div>;

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>🏢 Smart Office Energy Optimizer</h1>
        <div className="status-bar">
          <span>Total Rooms: {data.totalRooms}</span>
          {/* Dynamic Alert Badge */}
          <span className={data.wasteDetected > 0 ? "badge alert" : "badge success"}>
            {data.wasteDetected > 0 ? `⚠️ Energy Waste in ${data.wasteDetected} Rooms` : "✅ Optimization Perfect"}
          </span>
        </div>
      </header>

      <div className="room-grid">
        {data.rooms.map(room => {
          const isWasting = !room.occupied && room.lightsOn;
          
          return (
            <div key={room.id} className={`room-card ${isWasting ? 'waste-alert' : 'optimized'}`}>
              <h3>{room.name}</h3>
              <div className="room-stats">
                <p><strong>Occupancy:</strong> {room.occupied ? "👤 Detected" : "Empty"}</p>
                <p><strong>Lights:</strong> {room.lightsOn ? "💡 ON" : "🌑 OFF"}</p>
                <p><strong>Temp:</strong> {room.temperature}°C</p>
              </div>
              
              {isWasting && (
                <div className="action-required">
                  <p>ACTION: Auto-shutdown suggested!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="footer">
        <p>Live Sensor Data Simulation | Last Sync: {new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default App;