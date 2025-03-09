import axios from "axios";
import React, { useEffect, useState } from "react";

const WeatherInfo = ({ coordinates }) => {
  const [weather, setWeather] = useState(null);
  // const [coordinates, setCoordinates] = useState({ nx: null, ny: null });

  // 좌표를 자동으로 찾는 예시 맵
  // const coordinatesMap = useMemo(() => ({
  //   Seoul: { nx: 60, ny: 127 },
  //   Busan: { nx: 98, ny: 76 },
  //   Daegu: { nx: 92, ny: 75 },
  //   Incheon: { nx: 55, ny: 126 },
  // }), []);

  // useEffect(() => {
  //   if (location && coordinatesMap[location]) {
  //     setCoordinates(coordinatesMap[location]);
  //   } else {
  //     console.log("지역을 찾을 수 없습니다. 기본 좌표 사용.");
  //     setCoordinates({ nx: 60, ny: 127 }); // 기본값 서울
  //   }
  // }, [location, coordinatesMap]);

  console.log(coordinates)
  useEffect(() => {
    if (coordinates.nx && coordinates.ny) {
      const fetchWeatherData = async () => {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const date = new Date(new Date().setMonth(new Date().getMonth() - 1));
        const baseDate = date.toISOString().slice(0, 10).replace(/-/g, "");
        const baseTime = "0630";

        // 기상청 API URL
        const apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&numOfRows=10&pageNo=1&base_date=20250309&base_time=0500&nx=${String(coordinates.nx).split(".")[0]}&ny=${String(coordinates.ny).split(".")[0]}&dataType=JSON`;
        //http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&numOfRows=10&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${Number(coordinates.nx)}&ny=${Number(coordinates.ny)}&dataType=JSON
        

        try {
          const response = await axios.get(apiUrl);
          setWeather(response.data.response.body.items.item);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeatherData();
    }
  }, [coordinates]);

  return (
    <div>
      {weather ? (
        <div>
          <h2>Weather Forecast for {location}</h2>
          <div>
            {/* 날씨 데이터 출력 */}
            {weather.map((item, index) => {
              if (item.category === "T1H") {
                return <p key={index}>Temperature: {item.fcstValue}°C</p>;
              } else if (item.category === "SKY") {
                return (
                  <p key={index}>
                    Condition:{" "}
                    {item.fcstValue === "1"
                      ? "Clear"
                      : item.fcstValue === "3"
                      ? "Cloudy"
                      : "Rainy"}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherInfo;