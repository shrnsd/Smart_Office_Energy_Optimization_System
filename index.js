const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
app.set('json spaces', 2);
const PORT = 5000;

app.use(cors()); 
let officeRooms = [
    { id: 1, name: "Conference Room A", occupied: false, lightsOn: true, temperature: 24 }, 
    { id: 2, name: "CEO Cabin", occupied: true, lightsOn: true, temperature: 22 },          
    { id: 3, name: "Marketing Bay", occupied: true, lightsOn: true, temperature: 23 },      
    { id: 4, name: "Break Room", occupied: false, lightsOn: false, temperature: 26 },       
    { id: 5, name: "Server Room", occupied: false, lightsOn: true, temperature: 18 },       
];

function simulateSensors() {
    officeRooms = officeRooms.map(room => {
        const randomOccupancy = Math.random() > 0.7 ? !room.occupied : room.occupied;
        
        let randomLights = room.lightsOn;
        if (randomOccupancy === false && Math.random() > 0.5) {
            randomLights = true; 
        } else if (randomOccupancy === true) {
            randomLights = true; 
        }

        return { 
            ...room, 
            occupied: randomOccupancy, 
            lightsOn: randomLights,
            temperature: Math.round(room.temperature + (Math.random() * 2 - 1)) 
        };
    });
    console.log("Sensors Updated: Data refreshed.");
}

setInterval(simulateSensors, 5000);
app.get('/', (req, res) => {
    res.send(`
        <h1>🚀 Smart Office Server is Running!</h1>
        <p>This is the backend server. The simulation is active.</p>
        <p>View live data here: <a href="/api/sensors">/api/sensors</a></p>
    `);
});
app.get('/api/sensors', (req, res) => {
    const wasteCount = officeRooms.filter(r => !r.occupied && r.lightsOn).length;
    
    res.json({
        timestamp: new Date(),
        totalRooms: officeRooms.length,
        wasteDetected: wasteCount,
        rooms: officeRooms
    });
});

app.listen(PORT, () => {
    console.log(`Simulated IoT Server running on http://localhost:${PORT}`);
    
    const url = `http://localhost:${PORT}`;
    const startCommand = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    
    exec(`${startCommand} ${url}`);
});