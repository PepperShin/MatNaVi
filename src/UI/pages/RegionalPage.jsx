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
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  
  // URL에 지역 정보가 없으면 기본값으로 이동
  useEffect(() => {
    if (!province || !city) {
      navigate("/regional/경기도/수원시", { replace: true });
    }
  }, [province, city, navigate]);

  // 지역명으로 위도/경도 가져오기
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (province && city) {
        const result = await getCoordinatesByAddress(province, city);
        if (result) {
          setCoordinates(result);
        } else {
          console.error("❌ 좌표를 찾을 수 없습니다:", province, city);
        }
      }
    };
    fetchCoordinates();
  }, [province, city]);


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
      <TourList province={province} city={city} onDataComplete={handleDataComplete} /> {/* 지역명 props로 전달 */}
      </Container>
    </>
  );
};

export default RegionalPage;