<script lang="ts">
  import axios from 'axios';
  import supabase from '$lib/supabase';
  import WeatherChart from '$lib/components/WeatherChart.svelte';

  let city = '';
  let weatherData: any = null;
  let forecastData: { day: string; temp: number; humidity: number }[] = [];
  let errorMessage = '';

  const apiKey = import.meta.env.VITE_API_KEY;
  const weatherApiUrl = import.meta.env.VITE_WEATHER_API_URL;
  const forecastApiUrl = import.meta.env.VITE_FORECAST_API_URL;

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const weatherResponse = await axios.get(weatherApiUrl, {
        params: { q: city, appid: apiKey, units: 'metric' }
      });

      const forecastResponse = await axios.get(forecastApiUrl, {
        params: { q: city, appid: apiKey, units: 'metric' }
      });

      weatherData = {
        temp: weatherResponse.data.main.temp,
        description: weatherResponse.data.weather[0].description,
        humidity: weatherResponse.data.main.humidity
      };

      forecastData = forecastResponse.data.list
        .filter((_, i) => i % 8 === 0)
        .map((f) => ({
          day: new Date(f.dt * 1000).toLocaleString('en', { weekday: 'short' }),
          temp: f.main.temp,
          humidity: f.main.humidity
        }));

      errorMessage = '';

      const { error } = await supabase.from('weather_searches').insert([{ city }]);
      if (error) console.error('Supabase insert error:', error.message);
    } catch (error) {
      errorMessage = 'Error fetching weather data. Please try again.';
      weatherData = null;
      forecastData = [];
    }
  };
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
  <h1 class="text-3xl font-bold mb-4">Weather Tracker</h1>

  <!-- City input -->
  <input
    type="text"
    bind:value={city}
    placeholder="Enter city name"
    class="p-2 mb-4 text-lg rounded-lg border border-gray-300"
  />

  <!-- Fetch button -->
  <button
    on:click={fetchWeather}
    class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    Get Weather
  </button>

  <!-- Error Message -->
  {#if errorMessage}
    <p class="mt-4 text-red-500">{errorMessage}</p>
  {/if}

  <!-- Weather Data -->
  {#if weatherData}
    <div class="mt-6 text-center">
      <h2 class="text-2xl">Current Weather in {city}</h2>
      <p class="text-xl mt-2">{weatherData.temp}°C, {weatherData.description}</p>
      <p class="mt-2">Humidity: {weatherData.humidity}%</p>
    </div>

    <!-- Weather Forecast Chart -->
    <div class="mt-6 w-full max-w-xl">
      <h3 class="text-xl font-semibold text-center mb-4">5-Day Forecast Analysis</h3>
      <WeatherChart
        labels={forecastData.map(d => d.day)}
        temperatures={forecastData.map(d => d.temp)}
        humidities={forecastData.map(d => d.humidity)}
      />
    </div>

    <!-- 5-Day Forecast Display -->
    <div class="mt-6 w-full max-w-xl">
      <h3 class="text-xl font-semibold text-center mb-4">5-Day Forecast</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each forecastData as { day, temp, humidity }}
          <div class="bg-white p-4 rounded-lg shadow-md text-center">
            <h4 class="text-lg font-semibold">{day}</h4>
            <p class="mt-2">{temp}°C</p>
            <p class="mt-1">Humidity: {humidity}%</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
