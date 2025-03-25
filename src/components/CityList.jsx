// src/components/CityList.jsx
import React, { useState, useEffect } from "react";
import { ListGroup, Nav } from "react-bootstrap";
import { getNearbyCities } from "../api/Location";

export default function CityList({ 
  userLocation, 
  distanceFilter, 
  selectedCity, 
  onCitySelect,
  onProvinceSelect // province 선택 시 부모에 전달 (선택 사항)
}) {
  const [groupedCities, setGroupedCities] = useState({});
  const [selectedProvinceTab, setSelectedProvinceTab] = useState("");

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
        const provinces = Object.keys(groups);
        if (provinces.length > 0) {
          // 초기 선택 탭 설정: 현재 선택된 탭이 없거나 그룹에 존재하지 않으면 첫 번째 탭 선택
          if (!selectedProvinceTab || !groups[selectedProvinceTab]) {
            setSelectedProvinceTab(provinces[0]);
            if (onProvinceSelect) onProvinceSelect(provinces[0]);
          }
        }
      });
    } else if (userLocation) {
      // fallback: 서울특별시의 유효한 구 (예: 종로구)
      const fallback = {
        "서울특별시": [{ name: "종로구", lat: 37.5729, lng: 126.9794, distance: 0, province: "서울특별시" }]
      };
      setGroupedCities(fallback);
      setSelectedProvinceTab("서울특별시");
      if (onProvinceSelect) onProvinceSelect("서울특별시");
    } else {
      setGroupedCities({});
      setSelectedProvinceTab("");
    }
  }, [userLocation, distanceFilter, onProvinceSelect, selectedProvinceTab]);

  return (
    <>
      {Object.keys(groupedCities).length === 0 ? (
        <p>해당 반경 내의 도/시/군/구 정보가 없습니다.</p>
      ) : (
        <>
          {/* 상단 탭: province 별로 그룹핑 */}
          <Nav variant="tabs" activeKey={selectedProvinceTab} onSelect={(k) => {
            setSelectedProvinceTab(k);
            if (onProvinceSelect) onProvinceSelect(k);
          }}>
            {Object.keys(groupedCities).map((prov) => (
              <Nav.Item key={prov}>
                <Nav.Link eventKey={prov}>{prov}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          {/* 선택된 province 탭의 하위 시/군/구 목록 */}
          <ListGroup className="mt-3">
            {groupedCities[selectedProvinceTab] &&
              groupedCities[selectedProvinceTab].map((city) => (
                <ListGroup.Item
                  key={city.name}
                  action
                  active={city.name === selectedCity}
                  onClick={() => onCitySelect(city.name, { lat: city.lat, lng: city.lng })}
                >
                  {city.name} ({city.distance.toFixed(1)} km)
                </ListGroup.Item>
              ))}
          </ListGroup>
        </>
      )}
    </>
  );
}
