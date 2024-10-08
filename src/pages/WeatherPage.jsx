import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  WiSunrise,
  WiSunset,
  WiHumidity,
  WiBarometer,
  WiThermometer,
  WiStrongWind,
  WiCloud,
  WiSmoke,
} from "react-icons/wi";
import { ClipLoader } from "react-spinners"; // Import the spinner

const WeatherPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate(); 
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=78793e454552ba50e695b25ba2d02a4a&units=metric`
        );
        setWeatherData(weatherResponse.data);

        const airQualityResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=78793e454552ba50e695b25ba2d02a4a`
        );
        setAirQualityData(airQualityResponse.data);
      } catch (error) {
        setError("Failed to fetch weather data.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (cityName) {
      fetchWeatherData();
    }
  }, [cityName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <ClipLoader color="#3498db" size={50} />
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData || weatherData.cod !== 200 || !airQualityData) {
    return (
      <div className="text-center">
        <p>Weather or air quality data not available.</p>
      </div>
    );
  }

  // Destructure needed data
  const { name, sys, weather, main, wind, visibility } = weatherData;
  const { temp, feels_like, humidity, pressure } = main;
  const { speed: windSpeed } = wind;

  // Utility function to format sunrise/sunset times
  const formatUnixTimestamp = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Current day and time
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString();

  // Function to return the background class or image based on weather type
  const weatherType = weather[0]?.main.toLowerCase();
  const weatherBgMap = {
    clear: "bg-clear-sunny", // you can set custom class or image for different weather
    clouds: "bg-cloudy",
    rain: "bg-rainy",
    snow: "bg-snowy",
    drizzle: "bg-drizzle",
    thunderstorm: "bg-thunderstorm",
    smoke: "bg-smoke",
  };
  const weatherBgClass = weatherBgMap[weatherType] || "bg-default"; 

  // Function to get air quality status
  const getAirQualityStatus = (aqi) => {
    switch (aqi) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={`container mx-auto p-4 ${weatherBgClass} h-screen`}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="p-2 mb-4 text-white bg-blue-500 rounded"
      >
        Back to Home
      </button>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold text-center text-white">
        Weather in {name}, {sys.country}
      </h1>

      {/* Main Weather Section */}
      <div className="flex flex-wrap justify-center">
        <div className="w-full p-4 lg:w-1/2">
          <div className="p-6 text-white rounded-lg shadow-lg bg-opacity-80 bg-gradient-to-r from-blue-400 to-blue-600">
            {/* Current Date and Time */}
            <div className="text-right right-2">
              <p className="text-lg text-white">{currentDay}</p>
              <p className="text-2xl font-semibold text-white">{currentTime}</p>
            </div>

            {/* Temperature and Description */}
            <div className="left-0 text-left">
              <h2 className="text-5xl font-bold text-white">{temp}°C</h2>
              <p className="text-xl text-gray-100">
                {weather[0].main} ({weather[0].description})
              </p>
            </div>

            {/* Weather Details Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
              {/* Temperature */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <WiThermometer className="mx-auto text-4xl text-blue-500" />
                <p className="text-lg text-center text-gray-800">
                  <strong>Feels Like:</strong> {feels_like}°C
                </p>
              </div>

              {/* Humidity */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <WiHumidity className="mx-auto text-4xl text-blue-500" />
                <p className="text-lg text-center text-gray-800">
                  <strong>Humidity:</strong> {humidity}%
                </p>
              </div>

              {/* Wind */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <WiStrongWind className="mx-auto text-4xl text-blue-500" />
                <p className="text-lg text-center text-gray-800">
                  <strong>Wind Speed:</strong> {windSpeed} m/s
                </p>
              </div>

              {/* Pressure */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <WiBarometer className="mx-auto text-4xl text-blue-500" />
                <p className="text-lg text-center text-gray-800">
                  <strong>Pressure:</strong> {pressure} hPa
                </p>
              </div>

              {/* Visibility */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <WiCloud className="mx-auto text-4xl text-blue-500" />
                <p className="text-lg text-center text-gray-800">
                  <strong>Visibility:</strong> {visibility / 1000} km
                </p>
              </div>

              {/* Air Quality */}
              {airQualityData && (
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <WiSmoke className="mx-auto text-4xl text-blue-500" />
                  <p className="text-lg text-center text-gray-800">
                    <strong>Air Quality:</strong>{" "}
                    {getAirQualityStatus(airQualityData.list[0].main.aqi)}
                  </p>
                </div>
              )}

              {/* Sunrise and Sunset */}
              <div className="w-full col-span-2 p-4 bg-white rounded-lg shadow-md md:px-12 md:col-span-3">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <WiSunrise className="mx-auto text-4xl text-yellow-400" />
                    <p className="text-lg text-gray-800">
                      <strong>Sunrise:</strong>{" "}
                      {formatUnixTimestamp(sys.sunrise)}
                    </p>
                  </div>
                  <div className="text-center">
                    <WiSunset className="mx-auto text-4xl text-orange-400" />
                    <p className="text-lg text-gray-800">
                      <strong>Sunset:</strong>{" "}
                      {formatUnixTimestamp(sys.sunset)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
