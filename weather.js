const emoji = document.getElementById('emoji');
const input = document.getElementById('city-input');

input.addEventListener('focus', () => emoji.textContent = '🤔');
input.addEventListener('blur', () => emoji.textContent = '😊');

async function getWeather() {
  const city = input.value.trim();
  if (!city) {
    alert('Please enter a city');
    return;
  }

  emoji.textContent = '😊';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const d = await res.json();

    document.getElementById('weather-info').innerHTML = `
      <h3>${d.name}</h3>
      <p>${d.weather[0].main} – ${d.main.temp}°C</p>
    `;
  } catch (error) {
    document.getElementById('weather-info').textContent = 'City not found!';
    emoji.textContent = '😕';
  }
}
