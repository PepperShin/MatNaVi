// src/components/TourList.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { getTouristAttractions, getAreaAndSigunguCode } from "../api/API";
import PaginationComponent from "./PaginationComponent";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { paginate } from "../utils/Pagination.js";
import { calculateDistance, getCurrentLocation } from "../api/Location.js";
import TourImage from "./TourImage";
import { calculateDynamicDensity } from "../utils/Density";
import { provinces, cityData } from "../data/locationData";

const TourList = ({ selectedProvince, selectedCity, setSelectedProvince, setSelectedCity }) => {
  
  const [travelList, setTravelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userLocation, setUserLocation] = useState(null);
  const hasCalculatedDistance = useRef(false);

  // 도 선택 변경 시
  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    setSelectedProvince(newProvince);
    setSelectedCity(cityData[newProvince][0]); // 해당 도의 첫 번째 시/군 자동 선택
  };
  
  // 시/군 선택 변경 시
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  useEffect(() => {
    getCurrentLocation((location) => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  // 관광지 정보 가져오기
  const fetchTouristData = async () => {
    setLoading(true);
    try {
      const { areaCode, sigunguCode } = getAreaAndSigunguCode(selectedProvince, selectedCity);
      //console.log("🔍 검색 지역 코드:", areaCode, sigunguCode);
      if (!areaCode) return console.error("❌ 지역코드 없음");
  
      const contentTypeIds = [12, 14, 15];
      let combinedData = [];
  
      // 12, 14, 15 각각에 대해 관광지 데이터 요청
      for (const id of contentTypeIds) {
        const attractions = await getTouristAttractions(areaCode, sigunguCode, id);
        combinedData = combinedData.concat(attractions);
      }
  
      //console.log("✅ 최종 관광지 데이터:", combinedData);
  
      // ✅ 밀집도 계산 적용
      const dataWithDensity = await calculateDynamicDensity(combinedData);
      // console.log("📌 밀집도 계산 완료:", dataWithDensity);
  
      setTravelList(dataWithDensity); // 밀집도 포함된 데이터 저장
  
    } catch (error) {
      console.error("❌ 관광지 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 거리 계산
  useEffect(() => {
    const updateDistances = async () => {
      if (!userLocation || travelList.length === 0 || hasCalculatedDistance.current) return;

      const updatedItems = await Promise.all(
        travelList.map(async (place) => {
          if (place.distance && place.distance !== "계산 중...") return place;

          let lat = Number(place.mapy);
          let lng = Number(place.mapx);

          if (!lat || !lng || lat === 0 || lng === 0 || isNaN(lat) || isNaN(lng)) {
            return { ...place, distance: "주소 변환 실패" };
          }

          const distance = calculateDistance(
            Number(userLocation.lat),
            Number(userLocation.lng),
            lat,
            lng
          );

          return {
            ...place,
            distance: isNaN(distance) ? "계산 실패" : `${distance.toFixed(2)}`,
          };
        })
      );

      setTravelList(updatedItems);
      hasCalculatedDistance.current = true;
    };

    updateDistances();
  }, [userLocation, travelList]);


  useEffect(() => {
    hasCalculatedDistance.current = false;
    fetchTouristData();
  }, [selectedProvince, selectedCity]);  // ✅ useEffect 닫는 부분 수정


  // 정렬
  const sortedList = useMemo(() => {
    let sorted = [...travelList];
    switch (sortOption) {
      case "별점순":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // ✅ rating이 없을 경우 0으로 처리
        break;
      case "거리순":
        sorted.sort((a, b) => {
          const distanceA = parseFloat(a.distance) || Infinity;
          const distanceB = parseFloat(b.distance) || Infinity;
          return distanceA - distanceB;
        });
        break;
      case "여행지 밀집도순":
        sorted.sort((a, b) => (b.density || 0) - (a.density || 0)); // ✅ density 없을 경우 0으로 처리
        break;
      default:
        break;
    }
    return sorted;
  }, [sortOption, travelList]);

  const currentItems = useMemo(() => paginate(sortedList, currentPage, itemsPerPage), [sortedList, currentPage]);

  return (
    <>
      <Row className="align-items-center mb-3">
        {/* 도 선택 */}
        <Col xs="auto">
          <Form.Select value={selectedProvince} onChange={handleProvinceChange}>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </Form.Select>
        </Col>

        {/* 시/군/구 선택 */}
        <Col xs="auto">
          <Form.Select value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince}>
            {cityData[selectedProvince].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Form.Select>
        </Col>


        {/* 정렬 옵션 */}
        <Col xs="auto" className="ms-md-auto">
          <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="정렬">정렬</option>
            <option value="별점순">별점순</option>
            <option value="거리순">거리순</option>
            <option value="여행지 밀집도순">여행지 밀집도순</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? <p>로딩 중...</p> : travelList.length === 0 ? <p>결과 없음</p> : currentItems.map((item) => (
        <Link to={`/tripinfo/${item.contentid}`} key={item.contentid} style={{ textDecoration: "none", color: "inherit" }}>
          <Row className="border p-3 mb-2">
            <Col xs={12} md={4}>
              <TourImage spotName={item.title} description={item.overview || "설명 정보가 없습니다."} />
            </Col>
            <Col className="d-flex flex-column justify-content-center">
              <h5>{item.title}</h5>
              <p>주소: {item.addr1}</p>
              <p>거리: {item.distance ? `${item.distance}km` : "계산 중..."}</p>
              <p>밀집도: {item.density !== undefined ? item.density : "계산 중..."} (반경: {item.radius}km)</p>
            </Col>
          </Row>
        </Link>
      ))}
      <PaginationComponent totalItems={travelList.length} onPageChange={setCurrentPage} />
    </>
  );
};

export default TourList;