import './style.css'

(function addSearchbarListener() {
    document.querySelector("#search-form").addEventListener("submit", loadSearchedWeather)
})();

async function loadSearchedWeather(e) { 
    e.preventDefault();
    const value = document.querySelector(".search-input").value;

    if(value.trim()){
        const cleanValue = value.trim
        console.log(value);
        
        const weatherData = await getWeatherData(value);
        if(weatherData){
            displayLocation(value);
            loadTodayWeather(weatherData);
        }
        else {
            alert("Location not found")
        }
    } else {
        console.log("Please input a location");
    }
}

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=B7FH5FXVK8D8QGYND99MCZBT6&contentType=json`, {

        });
        if (!response.ok) {
            throw new Error("Something went wrong: " + response.status);
        }
        return await response.json();
    } catch (e) {
        alert(e);
    }
}

function extractCurrentData(weatherData) {
    console.log(weatherData);
    return {
        temp: weatherData.currentConditions.feelslike,
        precip: weatherData.currentConditions.precipprob,
        conditions: weatherData.currentConditions.conditions,
        icon: weatherData.currentConditions.icon,
        windspeed: weatherData.currentConditions.windspeed,
        humidity: weatherData.currentConditions.humidity
    }
}

function extractHourlyData(weatherData){
    const hourlyWeatherData = [];
    const currentHour = parseInt(weatherData.currentConditions.datetime.split(":")[0]);
    weatherData.days[0].hours.slice(currentHour).forEach(element => {
        hourlyWeatherData.push(
            {
                datetime: element.datetime.split(":")[0],
                temp: element.feelslike,
                icon: element.icon,
            }
        )
    });
    return hourlyWeatherData;
}

function extractWeeklyData(weatherData) {
    const weekWeather = [];
    const weekArray = weatherData.days.slice(1,8);
    console.log(weekArray);

    weekArray.forEach(day => {
        weekWeather.push({
            temp: day.temp,
            icon: day.icon,
            min: day.tempmin,
            max: day.tempmax,
            humidity: day.humidity,
            precip: day.precipprob
        });
    })

    return weekWeather;
}


async function getUserLocation() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if(!response.ok){
            throw new Error("Something went wrong: " + response.status);
        }
        const jsonData = await response.json();
        console.log(jsonData.city);
        return {city:jsonData.city};
    } catch (e) {
        alert(e);
    }
}

function loadTodayWeather(weatherData) {
    const currentWeather = extractCurrentData(weatherData);
    const hourlyWeather = extractHourlyData(weatherData);

    console.log(currentWeather);
    displayCurrentWeather(currentWeather);

    displayHourlyWeather(hourlyWeather);
}

function displayCurrentWeather(weatherData) {
    const icon = document.querySelector(".weather-icon");
    icon.src = `images/weather-icons/` + weatherData.icon + `.png`;
    icon.alt = weatherData.icon;

    const temp = document.querySelector(".current-temp");
    temp.textContent = weatherData.temp  + "º C";

    const precip = document.querySelector(".current-precip");
    precip.textContent = "Precipitation: " + weatherData.precip + `%`;

    const wind = document.querySelector(".current-wind");
    wind.textContent = "Wind Speed: " + weatherData.windspeed + "km/h";

    const humid = document.querySelector(".current-humid");
    humid.textContent = "Humidity: " + weatherData.humidity;
}

function displayHourlyWeather(weatherData) {
    const hourlyDiv = document.querySelector(".hourly-weather");
    while (hourlyDiv.firstChild) {
        hourlyDiv.removeChild(hourlyDiv.firstChild);
    }

    weatherData.forEach(hour => {
        const hourWeather = document.createElement("div");
        hourWeather.classList.add("hour-weather");

        const temp = document.createElement("h2");
        temp.textContent = hour.temp + "º C";
        hourWeather.appendChild(temp);
        
        const icon = document.createElement("img");
        icon.src = `images/weather-icons/` + hour.icon + `.png`;
        hourWeather.appendChild(icon);

        const hourDisplay = document.createElement("h3")
        hourDisplay.textContent = hour.datetime;
        hourWeather.appendChild(hourDisplay);

        hourlyDiv.appendChild(hourWeather);
    })
}

function loadWeeklyWeather(weatherData) {
    const weekWeather = extractWeeklyData(weatherData)

    displayWeeklyWeather(weekWeather);
}

function displayWeeklyWeather(weekWeather) {
    const weeklyWeather = document.querySelector(".weekly-weather");
    while (weeklyWeather.firstChild) {
        weeklyWeather.removeChild(weeklyWeather.firstChild);
    }

    weekWeather.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day-weather")

        const daySummary = document.createElement("div");
        daySummary.classList.add("day-summary");

        const temp = document.createElement("h2");
        temp.textContent = day.temp + "º C";

        const icon = document.createElement("img");
        icon.src = `images/weather-icons/` + day.icon + `.png`;

        daySummary.appendChild(icon);
        daySummary.appendChild(temp);
        dayDiv.appendChild(daySummary);

        const detailDiv = document.createElement("div");
        detailDiv.classList.add("day-detail")

        const min = document.createElement("h3");
        min.textContent = "Min: " + day.min + "º C";
        
        const max = document.createElement("h3");
        max.textContent = "Max: " + day.max + "º C";

        const precip = document.createElement("h3");
        precip.textContent = "Precipitation: " + day.precip + "%"

        const humid = document.createElement("h3");
        humid.textContent = "Humidity: " + day.humidity + "%";

        detailDiv.appendChild(min);
        detailDiv.appendChild(max);
        detailDiv.appendChild(precip);
        detailDiv.appendChild(humid);
        dayDiv.appendChild(detailDiv);
        weeklyWeather.appendChild(dayDiv);
    })
}

function displayLocation(location) {
    const locationDisplay = document.querySelector(".location-display");
    locationDisplay.textContent = location;
}

(async function loadInitialWeather() {
    const userLocation = await getUserLocation();
    displayLocation(userLocation.city);

    const weatherData = await getWeatherData(userLocation.city);
    console.log(weatherData);
    if(weatherData) {
        console.log(weatherData);
        loadTodayWeather(weatherData);
        loadWeeklyWeather(weatherData);
    }
    
})();