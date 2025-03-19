// src/components/CityList.jsx
import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { getNearbyCities } from "../api/Location";

export default function CityList({ 
  userLocation, 
  distanceFilter, 
  selectedCity, 
  onCitySelect,
  onProvinceSelect // province 선택 시 부모에 전달 (선택 사항)
}) {
  const [groupedCities, setGroupedCities] = useState({});

  useEffect(() => {
    if (userLocation && distanceFilter) {
      getNearbyCities(userLocation, distanceFilter).then((cities) => {
        // 각 항목: { name, lat, lng, distance, province }
        const groups = cities.reduce((acc, city) => {
          const { province } = city;
          if (!acc[province]) {
            acc[province] = [];
          }
          acc[province].push(city);
          return acc;
        }, {});
        setGroupedCities(groups);
      });
    } else if (userLocation) {
      // fallback: 서울특별시의 유효한 구 (예: 종로구)
      setGroupedCities({
        "서울특별시": [{ name: "종로구", lat: 37.5729, lng: 126.9794, distance: 0, province: "서울특별시" }]
      });
    } else {
      setGroupedCities({});
    }
  }, [userLocation, distanceFilter]);

  return (
    <>
      {Object.keys(groupedCities).length === 0 ? (
        <p>해당 반경 내의 도/시/군/구 정보가 없습니다.</p>
      ) : (
        Object.entries(groupedCities).map(([province, cities]) => (
          <div key={province}>
            <h5>{province}</h5>
            <ListGroup className="mb-3">
              {cities.map((city) => (
                <ListGroup.Item
                  key={city.name}
                  action
                  active={city.name === selectedCity}
                  onClick={() => {
                    onCitySelect(city.name, { lat: city.lat, lng: city.lng });
                    if (onProvinceSelect) onProvinceSelect(province);
                  }}
                >
                  {city.name} ({city.distance.toFixed(1)} km)
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))
      )}
    </>
  );
}
