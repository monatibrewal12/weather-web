const apikey = '9fb4b1f8137cc4f19b69b110c0d43828'; // Your OpenWeatherMap API key

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url).then(res => {
                return res.json();
            }).then((data) => {
                weatherReport(data);
            });
        });
    }
});

// Handle search functionality for user input
document.getElementById('search').addEventListener('click', () => {
    var place = document.getElementById('input').value;

    if (place === "") {
        alert("Please enter a city name");
        return;
    }

    var urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;
    
    fetch(urlSearch).then(res => {
        return res.json();
    }).then((data) => {
        if (data.cod === "404") {
            alert("City not found");
            return;
        }
        weatherReport(data);
    });

    document.getElementById('input').value = '';
});

function weatherReport(data) {
    var urlCast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    fetch(urlCast).then(res => {
        return res.json();
    }).then((forecast) => {
        if (forecast.cod !== "200") {
            alert("Unable to retrieve forecast information");
            return;
        }
        hourForecast(forecast);
        dayForecast(forecast);

        document.getElementById('city').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').innerText = `${Math.floor(data.main.temp - 273.15)} °C`; // Convert Kelvin to Celsius
        document.getElementById('clouds').innerText = data.weather[0].description;

        let icon = data.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById('img').src = iconUrl;
    });
}

function hourForecast(forecast) {
    const hourlyContainer = document.getElementById('hourlyForecast');
    hourlyContainer.innerHTML = ''; // Clear previous data
    for (let i = 0; i < 5; i++) { // Display next 5 hours
        const hourData = forecast.list[i];
        const time = new Date(hourData.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const temp = Math.floor(hourData.main.temp - 273.15); // Convert Kelvin to Celsius
        const desc = hourData.weather[0].description;

        const hourElement = document.createElement('div');
        hourElement.className = 'next';
        hourElement.innerHTML = `
            <div>
                <p class="time">${time}</p>
                <p>${temp} °C</p>
            </div>
            <p class="desc">${desc}</p>
        `;
        hourlyContainer.appendChild(hourElement);
    }
}

function dayForecast(forecast) {
    const dailyContainer = document.getElementById('dailyForecast');
    dailyContainer.innerHTML = ''; // Clear previous data
    for (let i = 0; i < 4; i++) { // Display next 4 days
        const dayData = forecast.list[i * 8]; // Get data for each day (every 8th entry)
        const date = new Date(dayData.dt * 1000).toDateString();
        const tempMin = Math.floor(dayData.main.temp_min - 273.15);
        const tempMax = Math.floor(dayData.main.temp_max - 273.15);
        const desc = dayData.weather[0].description;

        const dayElement = document.createElement('div');
        dayElement.className = 'dayF';
        dayElement.innerHTML = `
            <p class="date">${date}</p>
            <p>${tempMax} °C / ${tempMin} °C</p>
            <p class="desc">${desc}</p>
        `;
        dailyContainer.appendChild(dayElement);
    }
}
