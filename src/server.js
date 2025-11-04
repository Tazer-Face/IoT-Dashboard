const express = require("express");
const app = express();
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const {connectDB,disconnectDB} = require("./config/databases");
const sensorData = require("./Sensor data/sensorData");

connectDB();

const port = 4000;

const server = app.listen(port ,() => {
  console.log("App + WebSocket running on port 4000");
});

sensorData(server);

app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

app.use('/api/users',userRoutes);
app.use('/api/devices',deviceRoutes);

process.on('SIGINT',() => disconnectDB('SIGINT'));
process.on('SIGTERM',() => disconnectDB('SIGTERM'));

app.listen(3000,()=>{console.log("server running on port 3000")});
