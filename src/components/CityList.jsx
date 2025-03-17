// src/components/CityList.jsx
// 도시 목록을 표시하는 컴포넌트 -> 화면 구성 요소

import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { getNearbyCities } from "../api/Location";

export default function CityList({ userLocation, onCitySelect, selectedCity }) {
  const [cities, setCities] = useState([]);
  
  useEffect(() => {
    if (userLocation) {
      getNearbyCities(userLocation).then(setCities);
    } else {
      // 기본 도시 목록 (유저 위치를 못 얻었을 때)
      setCities([
        { name: "지역 1", coord: { lat: 37.5665, lng: 126.9780 } },
        { name: "지역 2", coord: { lat: 35.1796, lng: 129.0756 } },
        { name: "지역 3", coord: { lat: 36.3504, lng: 127.3845 } }
      ]);
    }
  }, [userLocation]);
  
  return (
    <ListGroup>
      {cities.map((city) => (
        <ListGroup.Item 
          key={city.name}
          action
          active={city.name === selectedCity}
          onClick={() => onCitySelect(city.name, city.coord)}
          className="d-flex align-items-center"
        >
          • {city.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}