// src/pages/WeatherPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const WeatherPage = () => {
  const { cityName } = useParams();
  console.log('City Name:', cityName);  // Get the city name from the URL
  const [weatherData, setWeatherData] = useState(null); // Store weather data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchWeatherData = async () => {
      
      try {
        // Fetch weather data using Axios
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=78793e454552ba50e695b25ba2d02a4a&units=metric`
        );
        console.log(response.data)
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    if (cityName) { // Check if cityName is defined before making the API call
      fetchWeatherData();
    }
  }, [cityName]);
  

  if (loading) {
    return <div className="text-center">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

  if (!weatherData || weatherData.cod !== 200) {
    return <div className="text-center">Weather data not available.</div>;
  }

  // Destructure needed weather information
  const { name, sys, weather, main, wind, clouds, visibility } = weatherData;
  const { temp, feels_like, temp_min, temp_max, humidity, pressure } = main;
  const { speed: windSpeed, deg: windDirection } = wind;
  const description = weather[0].description;
  const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

  // Background image based on weather condition
  const backgroundImage = `url(http://openweathermap.org/img/wn/${weather[0].icon}.png)`;
  const formatUnixTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Weather in {name}, {sys.country}</h1>
      <div className='w-full max-w-5' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}></div>
      <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
        <h2 className="mb-2 text-xl font-semibold">Current Conditions</h2>
        <p className="mb-2"><strong>Temperature:</strong> {temp}°C (Feels like {feels_like}°C)</p>
      <p className="mb-2"><strong>Weather:</strong> {weather[0].main} ({weather[0].description})</p>
        <p className="mb-2"><strong>Min Temp:</strong> {temp_min}°C / <strong>Max Temp:</strong> {temp_max}°C</p>
        <p className="mb-2"><strong>Humidity:</strong> {humidity}%</p>
        <p className="mb-2"><strong>Pressure:</strong> {pressure} hPa</p>
        <p className="mb-2"><strong>Visibility:</strong> {visibility / 1000} km</p>
        <p className="mb-2"><strong>Wind Speed:</strong> {windSpeed} m/s (Direction: {windDirection}°)</p>
        <p className="mb-2"><strong>Cloudiness:</strong> {clouds.all}%</p>
        <p className="mb-2"><strong>Sunrise:</strong> {formatUnixTimestamp(sys.sunrise)}</p>
        <p className="mb-2"><strong>Sunset:</strong> {formatUnixTimestamp(sys.sunset)}</p>
      </div>
    </div>
  );
};

export default WeatherPage;
