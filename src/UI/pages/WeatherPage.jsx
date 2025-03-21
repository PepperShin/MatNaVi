import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getCurrentLocation } from '../../api/Location';
import '../../assets/css/weather.css';

const WeatherPage = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치 상태 추가

  // 사용자 위치 가져오기
  useEffect(() => {
    getCurrentLocation((loc) => {
      if (loc) {
        setUserLocation(loc); // 사용자 위치 업데이트
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
          const { lat, lng } = userLocation; // 사용자 위치에서 위도, 경도 가져오기
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
  }, [userLocation]); // 사용자 위치가 업데이트되면 날씨 데이터를 가져오도록 함

  // loading, error, noData 경우 처리
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
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // 5일간의 날씨 정보
  const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0); // 하루에 8번 예보 중 첫 번째 데이터만 필터링

  // 날씨 정보 렌더링
  return (
    <div className="weather-container">
      <h1 className="weather-title">주간 날씨 정보</h1>
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
