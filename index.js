const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');
const APIKey = '303b7ad4afd79c0daf56c9c1ebab4512';

document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

search.addEventListener('click', () => {
    getWeather();
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`);
        if (!response.ok) {
            if (response.status === 404) {
                return { cod: '404' };
            }
            throw new Error("API Issue");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function updateWeatherDetails(json) {
    const cityName = document.querySelector('.city-name');
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    const pollution = document.querySelector('.weather-details .pollution span');
    const coords = document.querySelector('.weather-details .coords span');

    cityName.textContent = `${json.name}, ${json.sys.country}`;

    const weatherImages = {
        'Clear': 'images/clear.png',
        'Rain': 'images/rain.png',
        'Snow': 'images/snow.png',
        'Clouds': 'images/cloud.png',
        'Haze': 'images/haze.png',
        'Mist': 'images/mist.png'
    };

    image.src = weatherImages[json.weather[0].main] || '';

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;
    pollution.innerHTML = `114514`;

    const showCoords = (lat, lon) =>
        `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}
        ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`;
    coords.innerHTML = showCoords(Math.floor(json.coord.lat), Math.floor(json.coord.lon));

    // 优化动画顺序
    const showContent = () => {
        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        
        // 延迟添加动画类
        setTimeout(() => {
            weatherBox.classList.add('fadeIn');
            setTimeout(() => {
                weatherDetails.classList.add('fadeIn');
                // 动态调整容器高度
                container.style.height = '590px';
            }, 200);
        }, 100);
    };

    if (weatherBox.classList.contains('fadeIn')) {
        // 如果已经显示内容，先淡出再显示新内容
        weatherBox.style.animation = 'fadeOut 0.3s forwards';
        weatherDetails.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            weatherBox.classList.remove('fadeIn');
            weatherDetails.classList.remove('fadeIn');
            // 重置动画
            weatherBox.style.animation = '';
            weatherDetails.style.animation = '';
            
            showContent();
        }, 300);
    } else {
        showContent();
    }
}

async function getWeather() {
    const city = input.value;

    if (city === '') return;

    const weatherData = await fetchWeather(city);

    if (weatherData && weatherData.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        input.value = ''; // 清空输入框
        return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    if (weatherData) {
        updateWeatherDetails(weatherData);
        input.value = ''; // 清空输入框
    }
}
