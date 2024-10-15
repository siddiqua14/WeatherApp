const apiKey = "242795750ced3d6beb86fb484f70a74a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast-items-container");
const locationDateContainer = document.querySelector(".location-date-container");
const currentDateElement = document.querySelector(".current-date");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        locationDateContainer.style.display = "none";
        forecastContainer.innerHTML = ''; // Clear forecast
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/hr";

        // Update date and display location
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        currentDateElement.innerHTML = formattedDate;
        locationDateContainer.style.display = "flex";

        // Weather icon logic
        const weatherMain = data.weather[0].main;
        weatherIcon.src = `images/${getWeatherIcon(weatherMain)}`;

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

        // Fetch and display forecast data
        fetchForecast(city);
    }
}

// Fetch 5-day forecast data
async function fetchForecast(city) {
    const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    const forecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    forecastContainer.innerHTML = ''; // Clear old forecast

    forecasts.forEach(forecast => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");

        const date = new Date(forecast.dt_txt).toLocaleDateString('en-US', {
            weekday: 'short', day: 'numeric', month: 'short'
        });

        const weatherMain = forecast.weather[0].main;
        const icon = getWeatherIcon(weatherMain);

        forecastItem.innerHTML = `
            <h5>${date}</h5>
            <img src="images/${icon}" alt="${weatherMain}">
            <h5>${Math.round(forecast.main.temp)}°C</h5>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// Function to determine the weather icon based on weather type
function getWeatherIcon(weather) {
    if (weather == "Clouds") return "clouds.png";
    if (weather == "Clear") return "clear.png";
    if (weather == "Rain") return "rain.png";
    if (weather == "Drizzle") return "drizzle.png";
    if (weather == "Mist") return "mist.png";
    return "clouds.svg"; // Default icon if none match
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
