let appId = "fd44bc8b7f1553122dbaf590f884ddd8";
let searchMethod; 

function getSearchMethod(searchTerm) {
  if (
    searchTerm.length === 5 &&
    Number.parseInt(searchTerm) + "" === searchTerm
  )
    searchMethod = "zip";
  else searchMethod = "q";
}

function searchWeather(searchTerm) {
  getSearchMethod(searchTerm);
  //api.openweathermap.org/data/2.5/forecast?q=
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?${searchMethod}=${searchTerm}&APPID=${appId}&units=metric`
  )
    .then(result => {
      return result.json();
    })
    .then(res => {
      init(res);
    });
}

function init(resultFromServer) {
  console.log(resultFromServer);
  switch (resultFromServer.list[0].weather[0].main) {
    case "Clear":
      document.body.style.backgroundImage = "url('clear.jpg')";
      break;

    case "Clouds":
      document.body.style.backgroundImage = "url('cloudy.jpg')";
      break;

    case "Rain":
    case "Drizzle":
    case "Mist":
      document.body.style.backgroundImage = "url('rain.jpg')";
      break;

    case "Thunderstorm":
      document.body.style.backgroundImage = "url('storm.jpg')";
      break;

    case "Snow":
      document.body.style.backgroundImage = "url('snow.jpg')";
      break;

    default:
      break;
  }

  let weatherDescriptionHeader = document.getElementById(
    "weatherDescriptionHeader"
  );
  let temperatureElement = document.getElementById("temperature");
  let humidityElement = document.getElementById("humidity");
  let windSpeedElement = document.getElementById("windSpeed");
  let cityHeader = document.getElementById("cityHeader");

  let weatherIcon = document.getElementById("documentIconImg");
  weatherIcon.src =
    "http://openweathermap.org/img/w/" +
    resultFromServer.list[0].weather[0].icon +
    ".png";

  let resultDescription = resultFromServer.list[0].weather[0].description;
  weatherDescriptionHeader.innerText =
    resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
  temperatureElement.innerHTML =
    Math.floor(resultFromServer.list[0].main.temp) + "&#176;";
  windSpeedElement.innerHTML =
    "Winds at  " + Math.floor(resultFromServer.list[0].wind.speed) + " m/s";
  cityHeader.innerHTML = resultFromServer.city.name;
  humidityElement.innerHTML =
    "Humidity levels at " + resultFromServer.list[0].main.humidity + "%";

  setPositionForWeatherInfo();
  dajPrognozu(resultFromServer);
}

function setPositionForWeatherInfo() {
  let weatherContainer = document.getElementById("weatherContainer");
  let weatherContainerHeight = weatherContainer.clientHeight;
  let weatherContainerWidth = weatherContainer.clientWidth;

  weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
  weatherContainer.style.top = `calc(50% - ${weatherContainerHeight / 1.3}px)`;
  weatherContainer.style.visibility = "visible";
}

function dajPrognozu(resultFromServer) {
  let dani = [
    "Nedjelja",
    "Ponedjeljak",
    "Utorak",
    "Srijeda",
    "Četvrtak",
    "Petak",
    "Subota"
  ];
  let prognozaContainer = document.getElementById("prognozaContainer");
  for (let i = 1; i <= 5; i++) {
    let danUSedmici = document.createElement("p");
    let txt = document.createTextNode(
      `${dani[new Date(resultFromServer.list[8 * i - 1].dt * 1000).getDay()]}`
    );
    danUSedmici.appendChild(txt);
    let div = document.createElement("div");
    div.setAttribute("class", "divPrognoza");
    let p = document.createElement("p");
    var text = document.createTextNode(
      `${Math.floor(resultFromServer.list[8 * i - 1].main.temp)}` + "°C"
    );
    p.appendChild(text);
    let ikonaVremena = document.createElement("img");
    ikonaVremena.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${
        resultFromServer.list[8 * i - 1].weather[0].icon
      }@2x.png`
    );
    ikonaVremena.setAttribute("width", "50px");
    div.appendChild(p);
    div.appendChild(ikonaVremena);
    prognozaContainer.appendChild(danUSedmici);
    prognozaContainer.appendChild(div);
  }
  prognozaContainer.style.visibility = "visible";
}

document.getElementById("searchBtn").addEventListener("click", () => {
  let searchTerm = document.getElementById("searchInput").value;
  if (searchTerm) searchWeather(searchTerm);
});
