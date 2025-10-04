const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

const apiKey = "bd5e378503939ddaee76f12ad7a97608"; 
// I use publc API key -> Just follow this link -> https://gist.github.com/lalithabacies/c8f973dc6754384d6cade282b64a8cb1
// or you can get your own key from https://openweathermap.org/api 
async function fetchData(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("City not found or API error");
        const data = await res.json();
        const labels = data.list.map(item => item.dt_txt);
        const temps = data.list.map(item => item.main.temp);
        return { labels, temps };
    } catch (err) {
        alert(err.message);
        return { labels: [], temps: [] };
    }
}

async function updateChart() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return alert("Please enter a city name");
    const { labels, temps } = await fetchData(city);
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = temps;
    myChart.update();
}

document.getElementById('updateBtn').addEventListener('click', updateChart);
