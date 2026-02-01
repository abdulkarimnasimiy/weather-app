window.addEventListener('DOMContentLoaded', () => {

  /* ================= LOADER ================= */
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }, 1200);

  /* ================= ELEMENTS ================= */
  const searchBox = document.querySelector('.search-box');
  const bg = document.getElementById('bg');

  /* ================= API KEYS ================= */
  const weatherKey = '71a4c531e6f23839db88372fc001401e'; // o‘zgarmadi
  const pexelsKey = 'dK7dRZWCu16Xk59UacZhqRKKddjZFmL7VmfW2iG72I9gK4DISMrJVfoW';

  /* ================= EVENTS ================= */
  searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchBox.value.trim() !== '') {
      getWeatherByCity(searchBox.value.trim());
      searchBox.value = '';
    }
  });

  /* ================= GEOLOCATION ================= */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        getWeatherByCity('Tashkent'); // fallback
      }
    );
  } else {
    getWeatherByCity('Tashkent');
  }

  /* ================= OPENWEATHER ================= */
  async function getWeatherByCity(city) {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
    requestWeather(url);
  }

  async function getWeatherByCoords(lat, lon) {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`;
    requestWeather(url);
  }

  async function requestWeather(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Shahar topilmadi');
      const data = await res.json();
      displayResults(data);
      setBackground(data.name, data.weather[0].main);
    } catch (err) {
      alert(err.message);
    }
  }

  /* ================= UI UPDATE ================= */
  function displayResults(weather) {
    document.querySelector('.location .city').innerHTML =
      `${weather.name}, ${weather.sys.country}`;

    document.querySelector('.location .date').innerHTML =
      dateBuilder(new Date());

    document.querySelector('.temp').innerHTML =
      `${Math.round(weather.main.temp)}°C`;

    document.querySelector('.weather').innerHTML =
      weather.weather[0].main;

    document.querySelector('.hi-low').innerHTML =
      `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
  }

  /* ================= PEXELS BACKGROUND ================= */
  async function setBackground(city, weather) {
    const query = `${city} city`;

    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        {
          headers: {
            Authorization: pexelsKey
          }
        }
      );

      if (!res.ok) throw new Error('Pexels error');

      const data = await res.json();

      if (data.photos && data.photos.length > 0) {
        bg.style.backgroundImage =
          `url(${data.photos[0].src.large2x})`;
      }
    } catch (err) {
      console.log('Background yuklanmadi');
    }
  }

  /* ================= DATE ================= */
  function dateBuilder(d) {
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const days = [
      'Sunday','Monday','Tuesday','Wednesday',
      'Thursday','Friday','Saturday'
    ];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

});
