import axios from "axios";
import React, { useState, useEffect } from "react";
import "../../assets/css/weather.css";

const WeatherPage = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_KEY;
        const city = "Seoul";
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        setForecastData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!forecastData) {
    return <div className="no-data">No data available</div>;
  }

  // 요일 배열
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 5일간의 날씨 정보
  const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0); // 하루에 8번씩 예보가 나오므로, 8번째 데이터만 필터링

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weekly Forecast</h1>
      <div className="weather-week">
        {dailyForecast.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const dayName = daysOfWeek[date.getDay()];
          return (
            <div key={index} className="weather-day">
              <p className="weather-day-name">{dayName}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                className="weather-icon"
              />
              <p className="temperature">{Math.round(item.main.temp)}°C</p>
              <p className="weather-description">{item.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherPage;
