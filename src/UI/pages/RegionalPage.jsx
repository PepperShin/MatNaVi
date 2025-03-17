import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import TourList from "../../components/TourList";
import { useParams, useNavigate } from "react-router-dom";

const RegionalPage = () => {
  const { areaName } = useParams(); // URL에서 지역명 가져오기
  const navigate = useNavigate();

  // 지역명이 없는 경우 "수원"으로 리디렉션
  useEffect(() => {
    if (!areaName) {
      navigate("/regional/수원", { replace: true });
    }
  }, [areaName, navigate]);

  const handleDataComplete = (data) => {
    console.log("✅ 최종 데이터:", data);
  };
  return (
    <>
      <Header />
      <Container className="my-4">
      <TourList areaName={areaName} onDataComplete={handleDataComplete} /> {/* 지역명 props로 전달 */}
      </Container>
    </>
  );
};

export default RegionalPage;
