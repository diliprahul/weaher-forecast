/* ───────── CONFIG ───────── */
const apiKey  = 'd772b6de1611b4af5e79c505eff24fb1';   // ← your real key
const emojiDiv = document.getElementById('emoji');

/* ──────── MAIN ENTRY ──────── */
async function getWeather () {
  const city = document.getElementById('city').value.trim();
  if (!city) { alert('Please enter a city'); return; }

  setEmoji('thinking');

  const currentURL  = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([ fetch(currentURL), fetch(forecastURL) ]);
    if (!currentRes.ok || !forecastRes.ok) throw new Error('City not found');

    const currentData  = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(currentData);
    displayHourlyForecast(forecastData.list);
    setEmoji(currentData.weather[0].main);   // pick emoji by weather group
  } catch (err) {
    console.error(err);
    alert('Could not fetch weather for that city.');
    setEmoji('error');
  }
}

/* ───── Display current conditions ───── */
function displayWeather (data) {
  const tempDiv = document.getElementById('temp-div');
  const infoDiv = document.getElementById('weather-info');
  const iconImg = document.getElementById('weather-icon');

  // icon
  const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  iconImg.src   = iconURL;
  iconImg.alt   = data.weather[0].description;
  iconImg.style.display = 'block';

  // temperature
  tempDiv.innerHTML = `<p>${Math.round(data.main.temp)}°C</p>`;

  // extras
  const rain1h = data.rain && data.rain['1h'] ? `${data.rain['1h']} mm (last h)` : '0 mm';

  infoDiv.innerHTML = `
    <p><strong>${data.name}</strong> – ${data.weather[0].description}</p>
    <p><strong>Feels&nbsp;like:</strong> ${Math.round(data.main.feels_like)}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
    <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
    <p><strong>Rain&nbsp;(1 h):</strong> ${rain1h}</p>
  `;
}

/* ───── Display next 24 h (8 × 3‑hour) ───── */
function displayHourlyForecast (list) {
  const hourlyDiv = document.getElementById('hourly-forecast');
  hourlyDiv.innerHTML = '';                       // clear old

  list.slice(0, 8).forEach(entry => {
    const hr   = new Date(entry.dt * 1000).getHours().toString().padStart(2,'0');
    const temp = Math.round(entry.main.temp);
    const ic   = entry.weather[0].icon;

    hourlyDiv.insertAdjacentHTML(
      'beforeend',
      `
        <div class="hourly-item">
          <span>${hr}:00</span>
          <img src="https://openweathermap.org/img/wn/${ic}.png" alt="">
          <span>${temp}°C</span>
        </div>
      `
    );
  });
}

/* ───── Emoji reactions ───── */
function setEmoji (state) {
  const map = {
    thinking : '🤔',
    error    : '😕',
    Clear    : '☀️',
    Clouds   : '🌥️',
    Rain     : '🌧️',
    Drizzle  : '🌦️',
    Thunderstorm : '⛈️',
    Snow     : '❄️',
    Mist     : '🌫️',
    Smoke    : '🌫️',
    Haze     : '🌫️',
    Dust     : '🌫️',
    Fog      : '🌫️',
    Sand     : '🌫️',
    Ash      : '🌫️',
    Squall   : '🌬️',
    Tornado  : '🌪️'
  };
  emojiDiv.textContent = map[state] || '😊';
}

/* ───── UX helpers ───── */
document.getElementById('city').addEventListener('focus', () => setEmoji('thinking'));
document.getElementById('city').addEventListener('blur' , () => setEmoji(''));
