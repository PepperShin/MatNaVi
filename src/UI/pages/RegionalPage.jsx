// src/UI/pages/RegionalPage.jsx

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import TourList from "../../components/TourList";
import { useParams, useNavigate } from "react-router-dom";
import { getCoordinatesByAddress } from "../../api/API";
import DestinationMap from "../../components/DestinationMap";

const RegionalPage = () => {
  const { province, city } = useParams(); // URL에서 지역명 가져오기
  const navigate = useNavigate();

  // 선택된 지역 상태를 RegionalPage에서 관리
  const [selectedProvince, setSelectedProvince] = useState(province || "경기도");
  const [selectedCity, setSelectedCity] = useState(city || "수원시");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // URL에 지역 정보가 없으면 기본값으로 이동
  useEffect(() => {
    if (!province || !city) {
      navigate("/regional/경기도/수원시", { replace: true });
    }
  }, [province, city, navigate]);

  // 지역명 변경 시 지도 좌표 업데이트
  useEffect(() => {
    if (selectedProvince && selectedCity) {
      getCoordinatesByAddress(selectedProvince, selectedCity).then((coords) => {
        console.log("📍 API에서 받은 새로운 좌표:", coords);
        if (coords) {
          setCoordinates(coords);
        } else {
          console.error("❌ 좌표를 찾을 수 없습니다:", selectedProvince, selectedCity);
        }
      });
    }
  }, [selectedProvince, selectedCity]);
  


  const handleDataComplete = (data) => {
    console.log("✅ 최종 데이터:", data);
  };

  return (
    <>
      <Header />
      <Container className="my-4">
      {coordinates.lat && coordinates.lng ? (
          <div style={{ width: "100%", height: "400px", marginBottom: "20px" }}>
            <DestinationMap lat={coordinates.lat} lng={coordinates.lng} zoom={14} />
          </div>
        ) : (
          <p>Loading map...</p>
        )}
        {/* TourList에 상태를 props로 전달하여 동기화 */}
        <TourList
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
            setSelectedProvince={setSelectedProvince}
            setSelectedCity={setSelectedCity}
          />
      </Container>
    </>
  );
};

export default RegionalPage;