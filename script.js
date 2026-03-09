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
                constructor(address, lat, long, temp, feelslike, humidity, cloudcover, precip) {
                    this.address = address;
                    this.lat = lat;
                    this.long = long;
                    this.temp = temp;
                    this.feelslike = feelslike;
                    this.humidity = humidity;
                    this.cloudcover = cloudcover;
                    this.precip = precip;
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
                weatherData.precipprob
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
    displayArea.textContent = error;
}

function displayWeather(data){
    const displayArea = document.getElementById("weather-display");
    // displayArea.innerHTML = ``;
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
        if (key === 'precip'){
            key='Chance of Precipitation(%)'
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


function showGif(){
    const gif = document.getElementById("weather-gif");
    if (gif){
        gif.classList.remove("hidden");
    }
}

function hideGif(){
    const gif = document.getElementById("weather-gif");
    if (gif){
        gif.classList.add("hidden");
    }
}
// function 

function determineGif(data){
    console.log("Deciding Gif");
    console.log(data);
    const temp = data.feelslike;
    const precip = data.precip;
    // console.log(typeof(temp));
    // console.log(typeof(precip));
    if (temp<5){
        return "Freezing Cold Weather GIF by SpongeBob SquarePants.gif";
    }else{
        if (precip>90){
            return "Raining Weather Report GIF.gif";
        }
        if (temp>35){
            return "Blazing Heat Wave GIF.gif";
        }
        return undefined;
    }

}

let userlocation ;
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    hideGif();
    getLocation();
    (()=>{
        const displayArea = document.getElementById("weather-display");
        displayArea.innerHTML = ``;
    })();

    showLoader();
    hitWeatherApi()
    .then(
        data=>{
            console.log(data);
            displayWeather(data);
            return data;
        }
        
    )
    .then((data)=>{
        const gifAddress = determineGif(data);
        console.log(gifAddress);
        
        const gifArea = document.getElementById('gif-area');
        let gif = document.getElementById('weather-gif'); 
        if (!gif){
            gif = document.createElement("img");
            gif.id = 'weather-gif';
            gifArea.appendChild(gif);
        }
        gif.src = gifAddress;
        showGif();
    })
    .catch(error => {
        console.error("Error caught in event listener of button", error);
        setTimeout(() => {
            handleError("Possibly invalid input")
        },1000);
        handleError("Try again or Refresh!");
    })
    .finally(hideLoader);
});

