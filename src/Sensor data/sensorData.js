const { WebSocketServer } = require("ws");
const axios = require("axios");

module.exports = function(server) {

    const wss = new WebSocketServer({ server });
    let topic = [];

    wss.on("connection", (ws) => {
    console.log("WS client connected");

    axios.get('http://localhost:3000/api/devices/findAllDevices')
    .then(response=>{
        const allData = response.data;
        topic = allData.map(ele =>
            ele.topic
        );
        console.log(topic);
    })
    .catch(err =>{
        console.log(err);
    })

    setInterval(() => {
        topic.forEach((t) => {
            const randomNum = Math.floor(Math.random() * 100)+1;
            ws.send(JSON.stringify({ topic : t , value: randomNum }));
        });
    }, 3000);
    });

}
