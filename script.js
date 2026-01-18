const apiKey = "cb7e5dc7778c4b17886a624f5c7bd81e";

const cityInput = document.getElementById("cityInput");
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const feelsEl = document.getElementById("feels");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const greetingEl = document.getElementById("greeting");

setGreeting();
loadSavedWeather();

cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && cityInput.value.trim()) {
        fetchWeather(cityInput.value.trim());
        cityInput.blur();
    }
});

function setGreeting() {
    const hour = new Date().getHours();
    greetingEl.textContent =
        hour < 12 ? "Good Morning" :
        hour < 18 ? "Good Afternoon" :
        "Good Evening";
}

async function fetchWeather(city) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();

        if (data.cod !== 200) return;

        updateUI(data);
        localStorage.setItem("lastWeather", JSON.stringify(data));
    } catch {
        console.warn("Offline mode");
    }
}

function updateUI(data) {
    cityEl.textContent = data.name;
    tempEl.textContent = Math.round(data.main.temp);
    feelsEl.textContent = Math.round(data.main.feels_like);
    conditionEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed)} km/h`;

    setMood(data.weather[0].main);
}

function setMood(type) {
    const moods = {
        Clear: "#1f4037, #99f2c8",
        Clouds: "#485563, #29323c",
        Rain: "#373B44, #4286f4",
        Snow: "#83a4d4, #b6fbff",
        Thunderstorm: "#141E30, #243B55"
    };

    document.body.style.background = `linear-gradient(135deg, ${moods[type] || "#2c5364, #203a43"})`;
}

function loadSavedWeather() {
    const saved = localStorage.getItem("lastWeather");
    if (saved) updateUI(JSON.parse(saved));
}