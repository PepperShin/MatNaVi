// src/UI/pages/WeatherPage.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getCurrentLocation } from '../../api/Location';
import '../../assets/css/weather.css';

const WeatherPage = ({ startDate, endDate }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    getCurrentLocation((loc) => {
      if (loc) {
        setUserLocation(loc);
      } else {
        console.error('❌ 사용자 위치를 가져오지 못했습니다.');
        setLoading(false);
      }
    });
  }, []);

  // 날씨 데이터 가져오기
  useEffect(() => {
    if (userLocation) {
      const getWeatherData = async () => {
        try {
          const apiKey = import.meta.env.VITE_WEATHER_KEY;
          const { lat, lng } = userLocation;
          const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
          const response = await axios.get(url);
          setForecastData(response.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };
      getWeatherData();
    }
  }, [userLocation]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }
  if (!forecastData) {
    return <div className="no-data">No data available</div>;
  }

  // 전달받은 날짜를 YYYY-MM-DD 형식으로 비교하기 위해 사용
  // 만약 startDate와 endDate 모두 존재한다면 해당 기간 내의 예보를 선택
  // 만약 startDate만 존재한다면 그 날짜의 예보만 선택
  const filteredForecast = forecastData.list.filter(item => {
    const itemDateStr = new Date(item.dt * 1000).toISOString().slice(0, 10);
    if (startDate && endDate) {
      return itemDateStr >= startDate && itemDateStr <= endDate;
    } else if (startDate) {
      return itemDateStr === startDate;
    }
    return true;
  });

  // 하루에 여러 예보 항목이 있을 수 있으므로, 대표 예보(정오에 가까운 예보)를 선택
  const dailyForecast = Object.values(
    filteredForecast.reduce((acc, item) => {
      const itemDateStr = new Date(item.dt * 1000).toISOString().slice(0, 10);
      // 정오(12시)에 가까운 예보를 선택하도록 계산
      const targetHour = 12;
      const itemHour = new Date(item.dt * 1000).getHours();
      const diff = Math.abs(itemHour - targetHour);
      if (!acc[itemDateStr] || diff < Math.abs(new Date(acc[itemDateStr].dt * 1000).getHours() - targetHour)) {
        acc[itemDateStr] = item;
      }
      return acc;
    }, {})
  );

  // 요일 배열
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="weather-container">
      <h1 className="weather-title">선택한 일정의 날씨 정보</h1>
      {dailyForecast.length > 0 ? (
        <div className="weather-week">
          {dailyForecast.map((item, index) => {
            const dateObj = new Date(item.dt * 1000);
            const dayName = daysOfWeek[dateObj.getDay()];
            const dateStr = dateObj.toISOString().slice(0, 10);
            return (
              <div key={index} className="weather-day">
                <p className="weather-day-name">{dayName} ({dateStr})</p>
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
      ) : (
        <p>선택한 날짜에 해당하는 날씨 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default WeatherPage;
