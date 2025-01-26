const apiKey = 'ab4a484a4b1c1d7b95e905bd41487608';

// DOM Element Selectors
const searchInput = document.querySelector('.form-control');
const temperatureDisplay = document.querySelector('.content p');
const weatherIcon = document.querySelector('.custom-image');
const windSpeedDisplay = document.querySelector('.first p');
const humidityDisplay = document.querySelector('.second p');
const forecastCards = document.querySelectorAll('.card-container .card');

// Function to get weather icon based on weather condition
function getWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'assets/images/sunny.png',
        'Clouds': 'assets/images/cloudy-day-1.svg',
        'Rain': 'assets/images/rainy-1.png',
        'Thunderstorm': 'assets/images/thunder.png',
        'Snow': 'assets/images/snowflake.png',
        'Mist': 'assets/images/cloudy-day-1.svg'
    };
    return iconMap[condition] || 'assets/images/cloudy-day-1.svg';
}

// Fetch current weather data
async function getCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // Update current weather display
        temperatureDisplay.innerHTML = `${Math.round(data.main.temp)}<sup style="font-size: 74px;">°C</sup>`;
        weatherIcon.src = getWeatherIcon(data.weather[0].main);
        windSpeedDisplay.textContent = `wind ${Math.round(data.wind.speed)} Km/h`;
        humidityDisplay.textContent = `humidity ${data.main.humidity}%`;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        alert('Unable to fetch weather data. Please try again.');
    }
}

// Fetch 5-day forecast
async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // Process forecast data (every 8th entry is approximately a day later)
        forecastCards.forEach((card, index) => {
            const forecastIndex = index * 8;
            const forecastData = data.list[forecastIndex];
            
            card.querySelector('h3').textContent = `Day ${index + 1}`;
            card.querySelector('img').src = getWeatherIcon(forecastData.weather[0].main);
            card.querySelector('p').textContent = `${Math.round(forecastData.main.temp)}°C`;
        });
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Search functionality
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getCurrentWeather(city);
            getForecast(city);
        }
    }
});

// Initialize with a default city
getCurrentWeather('London');
getForecast('London');