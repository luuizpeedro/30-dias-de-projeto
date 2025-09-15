document.addEventListener("DOMContentLoaded", () => {
  // COLE SUA CHAVE DA API AQUI
  const apiKey = "6ebdcbda1036348ae4d70970fed64bd2   ";

  // MAPEAMENTO DE ELEMENTOS
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-btn");
  const weatherInfoDiv = document.getElementById("weather-info");
  const cityNameEl = document.getElementById("city-name");
  const weatherIconEl = document.getElementById("weather-icon");
  const temperatureEl = document.getElementById("temperature");
  const descriptionEl = document.getElementById("weather-description");
  const feelsLikeEl = document.getElementById("feels-like");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error-message");

  // FUNÇÃO PARA BUSCAR DADOS DO CLIMA
  async function getWeatherData(city) {
    loadingEl.classList.remove("hidden");
    weatherInfoDiv.classList.add("hidden");
    errorEl.classList.add("hidden");

    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }

      const data = await response.json();
      updateUI(data);
    } catch (error) {
      showError(error.message);
    } finally {
      loadingEl.classList.add("hidden");
    }
  }

  // FUNÇÃO PARA ATUALIZAR A INTERFACE
  function updateUI(data) {
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionEl.textContent = data.weather[0].description;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    updateBackground(data.weather[0].main);
    weatherInfoDiv.classList.remove("hidden");
  }

  // FUNÇÃO PARA ATUALIZAR O PLANO DE FUNDO
  function updateBackground(weather) {
    let backgroundUrl = "";
    switch (weather) {
      case "Clear":
        backgroundUrl =
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop";
        break;
      case "Clouds":
        backgroundUrl =
          "https://images.unsplash.com/photo-1495539403392-165f8038b3a3?q=80&w=2036&auto=format&fit=crop";
        break;
      case "Rain":
      case "Drizzle":
      case "Thunderstorm":
        backgroundUrl =
          "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop";
        break;
      case "Snow":
        backgroundUrl =
          "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=2070&auto=format&fit=crop";
        break;
      default:
        backgroundUrl =
          "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop";
    }
    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  // EVENT LISTENERS
  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  });

  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        getWeatherData(city);
      }
    }
  });

  // INICIALIZAÇÃO - CARREGA UMA CIDADE PADRÃO
  getWeatherData("Piracicaba");
});
