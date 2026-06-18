import './style.css'

document.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = document.querySelector(".search-input").value;

    if(value.trim()){
        console.log(value)
    } else {
        console.log("Please input a location")
    }
})

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=B7FH5FXVK8D8QGYND99MCZBT6&contentType=json`);
        if (!response.ok) {
            throw new Error("Something went wrong: " + response.status);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

function cleanupData(weatherData) {
    return {
        temp: weatherData.feelslike,
        precip: weatherData.precipprob,
        conditions: weatherData.conditions,
    }
}

