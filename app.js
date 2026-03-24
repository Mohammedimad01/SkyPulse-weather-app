/* ============================================================
   SkyPulse Weather App — JavaScript
   ============================================================ */

// ── API Configuration ──────────────────────────────────────────
// 🔑 API_KEY is now loaded from config.js to keep it out of the public repo!
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ── DOM References ─────────────────────────────────────────────
const cityInput     = document.getElementById('cityInput');
const searchBtn     = document.getElementById('searchBtn');
const locationBtn   = document.getElementById('locationBtn');
const loader        = document.getElementById('loader');
const errorMsg      = document.getElementById('errorMsg');
const errorText     = document.getElementById('errorText');
const weatherCard   = document.getElementById('weatherCard');
const unitToggle    = document.getElementById('unitToggle');

// Display elements
const elCity        = document.getElementById('cityName');
const elDateTime    = document.getElementById('dateTime');
const elIcon        = document.getElementById('weatherIcon');
const elTemp        = document.getElementById('temperature');
const elUnitLabel   = document.getElementById('unitLabel');
const elDesc        = document.getElementById('weatherDesc');
const elFeelsLike   = document.getElementById('feelsLike');
const elHumidity    = document.getElementById('humidity');
const elWind        = document.getElementById('windSpeed');
const elPressure    = document.getElementById('pressure');
const elVisibility  = document.getElementById('visibility');
const elSunrise     = document.getElementById('sunriseSunset');

// ── State ──────────────────────────────────────────────────────
let isCelsius       = true;   // current unit preference
let lastWeatherData = null;   // cache last API response for unit toggling

// ── Initialisation ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  bindEvents();
});

// ── Event Binding ──────────────────────────────────────────────
function bindEvents() {
  searchBtn.addEventListener('click', handleSearch);
  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  locationBtn.addEventListener('click', handleGeolocation);
  unitToggle.addEventListener('click', toggleUnit);
}

// ── Search Handler ─────────────────────────────────────────────
function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeatherByCity(city);
}

// ── Fetch weather by city name ─────────────────────────────────
async function fetchWeatherByCity(city) {
  showLoader();
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found. Please check the name and try again.');
      throw new Error('Something went wrong. Please try again later.');
    }
    const data = await res.json();
    lastWeatherData = data;
    isCelsius = true;
    updateUI(data);
  } catch (err) {
    showError(err.message);
  }
}

// ── Fetch weather by coordinates ───────────────────────────────
async function fetchWeatherByCoords(lat, lon) {
  showLoader();
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Unable to fetch weather for your location.');
    const data = await res.json();
    lastWeatherData = data;
    isCelsius = true;
    updateUI(data);
  } catch (err) {
    showError(err.message);
  }
}

// ── Geolocation ────────────────────────────────────────────────
function handleGeolocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    () => showError('Location access denied. Please allow location permission or search manually.')
  );
}

// ── Update the UI with weather data ────────────────────────────
function updateUI(data) {
  hideLoader();
  hideError();
  weatherCard.classList.remove('hidden');

  // Re-trigger slide-up animation
  weatherCard.style.animation = 'none';
  requestAnimationFrame(() => {
    weatherCard.style.animation = '';
  });

  // City & local date/time (using timezone offset from API)
  elCity.textContent = `${data.name}, ${data.sys.country}`;
  elDateTime.textContent = formatLocalTime(data.timezone);

  // Icon
  const iconCode = data.weather[0].icon;
  elIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  elIcon.alt = data.weather[0].description;

  // Temperature (always stored as Celsius from metric API)
  renderTemperature(data.main.temp, data.main.feels_like);

  // Description
  elDesc.textContent = data.weather[0].description;

  // Details
  elHumidity.textContent  = `${data.main.humidity}%`;
  elWind.textContent      = `${data.wind.speed} m/s`;
  elPressure.textContent  = `${data.main.pressure} hPa`;
  elVisibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

  // Sunrise / Sunset (converted to location-local time)
  const sunrise = formatUnixToTime(data.sys.sunrise, data.timezone);
  const sunset  = formatUnixToTime(data.sys.sunset, data.timezone);
  elSunrise.textContent = `${sunrise} / ${sunset}`;

  // Dynamic background
  setWeatherBackground(data.weather[0].main, iconCode);
}

// ── Render temperature values (respects current unit) ──────────
function renderTemperature(tempC, feelsLikeC) {
  if (isCelsius) {
    elTemp.textContent      = Math.round(tempC);
    elUnitLabel.textContent  = '°C';
    elFeelsLike.textContent  = `${Math.round(feelsLikeC)}°C`;
  } else {
    elTemp.textContent      = Math.round(tempC * 9 / 5 + 32);
    elUnitLabel.textContent  = '°F';
    elFeelsLike.textContent  = `${Math.round(feelsLikeC * 9 / 5 + 32)}°F`;
  }
}

// ── Toggle Celsius ↔ Fahrenheit ────────────────────────────────
function toggleUnit() {
  if (!lastWeatherData) return;
  isCelsius = !isCelsius;
  renderTemperature(lastWeatherData.main.temp, lastWeatherData.main.feels_like);
}

// ── Dynamic Background ────────────────────────────────────────
function setWeatherBackground(condition, iconCode) {
  const isNight = iconCode.endsWith('n');
  const gradients = {
    Clear:        isNight ? 'var(--grad-clear-night)' : 'var(--grad-clear-day)',
    Clouds:       'var(--grad-clouds)',
    Rain:         'var(--grad-rain)',
    Drizzle:      'var(--grad-rain)',
    Thunderstorm: 'var(--grad-thunder)',
    Snow:         'var(--grad-snow)',
    Mist:         'var(--grad-mist)',
    Haze:         'var(--grad-mist)',
    Fog:          'var(--grad-mist)',
    Smoke:        'var(--grad-mist)',
    Dust:         'var(--grad-mist)',
    Sand:         'var(--grad-mist)',
    Ash:          'var(--grad-mist)',
    Squall:       'var(--grad-rain)',
    Tornado:      'var(--grad-thunder)',
  };
  document.body.style.background = gradients[condition] || 'var(--grad-default)';
}

// ── Helpers: Time Formatting ───────────────────────────────────

/**
 * Returns a formatted local date-time string for the city
 * using the timezone offset (seconds) provided by the API.
 */
function formatLocalTime(timezoneOffset) {
  const now = new Date();
  // UTC time in ms + city offset in ms
  const localMs = now.getTime() + now.getTimezoneOffset() * 60000 + timezoneOffset * 1000;
  const localDate = new Date(localMs);
  return localDate.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Converts a UNIX timestamp to HH:MM format in the city's local time.
 */
function formatUnixToTime(unix, timezoneOffset) {
  const ms = (unix + timezoneOffset) * 1000;
  const d = new Date(ms);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

// ── UI State Helpers ───────────────────────────────────────────
function showLoader() {
  loader.classList.remove('hidden');
  weatherCard.classList.add('hidden');
  errorMsg.classList.add('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showError(msg) {
  hideLoader();
  weatherCard.classList.add('hidden');
  errorText.textContent = msg;
  errorMsg.classList.remove('hidden');
  // Re-trigger shake
  errorMsg.style.animation = 'none';
  requestAnimationFrame(() => {
    errorMsg.style.animation = '';
  });
}

function hideError() {
  errorMsg.classList.add('hidden');
}

// ── Floating Background Particles ──────────────────────────────
function createParticles() {
  const container = document.getElementById('bgParticles');
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 6 + 2;
    p.style.width  = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left   = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 15 + 10}s`;
    p.style.animationDelay    = `${Math.random() * 10}s`;
    container.appendChild(p);
  }
}
