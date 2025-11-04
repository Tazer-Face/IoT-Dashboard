const userName = sessionStorage.getItem("userName");

document.querySelector(".welcomeName").innerText = userName.toUpperCase();

const logout = document.querySelector(".logout");
logout.addEventListener("click", event => {
    event.preventDefault();
    setTimeout(() => {
        alert("Logging out");
        window.location.href = "Index.html";
    }, 1000);
});

const ws = new WebSocket("ws://localhost:4000/");
const sensorData = {};
const charts = {};       
const dataHistory = {};   
const maxPoints = 20;    

const container = document.getElementById("charts-container");

function createChart(topic) {

    const wrapper = document.createElement("div");
    wrapper.classList.add("chart-wrapper");

    const title = document.createElement("h3");
    title.innerText = topic;
    wrapper.appendChild(title);

    const canvas = document.createElement("canvas");
    canvas.id = topic;
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    dataHistory[topic] = [];

    const ctx = canvas.getContext("2d");
    charts[topic] = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], 
            datasets: [{
                label: topic,
                data: [],
                borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                backgroundColor: "rgba(0,255,255,0.1)",
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3 
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 300,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 500
                        },
                        color: '#ffffff' 
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                    backgroundColor: '#333',
                    titleColor: '#00ffff',
                    bodyColor: '#ffffff'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time",
                        font: { size: 14, weight: 600 },
                        color: '#ffffff' 
                    },
                    ticks: {
                        display: false, 
                        color: '#ffffff'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    title: {
                        display: true,
                        text: "Value",
                        font: { size: 14, weight: 600 },
                        color: '#ffffff' 
                    },
                    min: 0,
                    max: 100,
                    ticks: { color: '#ffffff' }, 
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

function updateChart(topic, value) {
    if (!charts[topic]) {
        createChart(topic);
    }

    const chart = charts[topic];
    const now = new Date().toLocaleTimeString();

    if (dataHistory[topic].length >= maxPoints) {
        dataHistory[topic].shift();
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    dataHistory[topic].push(value);
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(value);
    chart.update();
}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (Array.isArray(message)) {
        message.forEach(item => {
            sensorData[item.topic] = item.value;
            updateChart(item.topic, item.value);
        });
    } else {
        sensorData[message.topic] = message.value;
        updateChart(message.topic, message.value);
    }
};
