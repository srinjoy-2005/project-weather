function hitWeatherApi() {
    return fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userlocation}?unitGroup=metric&key=8GKKUTE8TLBLQHVE967SUBGNS&contentType=json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(data.message || `HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const weatherData = data.currentConditions;
            console.log(data.resolvedAddress);

            class DataFromApi {
                constructor(address, lat, long, temp, feelslike, humidity, cloudcover, datetime) {
                    this.address = address;
                    this.lat = lat;
                    this.long = long;
                    this.temp = temp;
                    this.feelslike = feelslike;
                    this.humidity = humidity;
                    this.cloudcover = cloudcover;
                    this.datetime = datetime;
                }
            }

            return new DataFromApi(
                data.resolvedAddress, 
                data.latitude, 
                data.longitude, 
                weatherData.temp, 
                weatherData.feelslike, 
                weatherData.humidity,
                weatherData.cloudcover,
                weatherData.datetime
            );
        });
}


function getLocation(){
    userlocation = document.getElementById("search-input").value;
    console.log("user entered this, from getLocation function: "+userlocation);
}

function handleError(error){
    console.error("Error fetching weather data:", error);
    const displayArea = document.getElementById("weather-display");
    displayArea.textContent = error.message || "An error occurred while fetching weather data.";
}

function displayWeather(data){
    const displayArea = document.getElementById("weather-display");
    displayArea.innerHTML = ``;
    Object.entries(data).forEach(([key, value]) => {
        const item = document.createElement("div");
        
        let formattedValue = value;
        if (key ==='address') formattedValue= formattedValue.toUpperCase();
        if (key === 'temp' || key === 'feelslike') formattedValue += '°';
        if (key === 'humidity') formattedValue += '%';

        if (key ==="feelslike"){
            key="Feels Like";
        }
        if (key ==="lat"){
            key="Latitude";
        }
        if (key ==="long"){
            key="Longitude";
        }
        if (key ==="address"){
            key="Location";
        }
        if (key ==="temp"){
            key="Temperature";
        }

        item.innerHTML = `
            <span class="weather-label">${key}</span>
            <span class="weather-value">${formattedValue}</span>
        `;
        displayArea.appendChild(item);
    });
}

function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}


let userlocation ;
const searchBtn = document.getElementById("search-button");

searchBtn.addEventListener("click", function(e) {
    e.preventDefault();
    getLocation();
    showLoader();
    hitWeatherApi().then(
        data=>{
            console.log(data);
            displayWeather(data);
        }
    )
    .catch(error => {
        console.error("Error caught in event listener of button", error);
        handleError(error);
    })
    .finally(hideLoader);


    // hitWeatherApi().then(data=>{
    //     const gifArea = document.getElementById("gif-area");
    //     gifArea.innerHTML = ``;
    //     // const 

    // })
    // .catch(error => {
    //     console.error("Error caught in event listener of button for GIF", error);
    //     handleError(error);
    // });
});

