// src/UI/pages/DistancePage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import DestinationMap from "../../components/DestinationMap";
import CityList from "../../components/CityList";
import TourImage from "../../components/TourImage";
import { getCurrentLocation, calculateDistance } from "../../api/Location";
import { fetchTourSpots } from "../../api/tourApi";
import { paginate } from "../../utils/Pagination";
import PaginationComponent from "../../components/PaginationComponent";

// 커스텀 훅: 쿼리 파라미터 읽기
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Matnavi() {
  const query = useQuery();
  const queryDistance = parseFloat(query.get("distance")); // 이전 페이지에서 입력한 거리(km)

  // 선택한 도시명(지역 리스트에서 선택한 경우)와 사용자의 현재 위치를 관리
  const [selectedCity, setSelectedCity] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: 37.5665,
    lng: 126.9780,
  });
  
  // API로부터 받아온 관광지(여행지) 리스트와 로딩 상태
  const [tourSpots, setTourSpots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 컴포넌트 마운트 시 사용자의 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation(setUserLocation);
  }, []);

  // 사용자 위치, 선택한 도시, 또는 queryDistance가 변경되면 관광지 정보를 불러옵니다.
  useEffect(() => {
    if (!userLocation) return; // 위치 정보가 없으면 대기

    setLoading(true);
    // 만약 사용자가 도시를 선택하지 않았고 queryDistance가 있다면, 기본값으로 "서울"을 사용하거나
    // 넓은 범위의 데이터를 받아온 후 클라이언트 측에서 거리 필터링을 수행합니다.
    const city = selectedCity || "서울";
    fetchTourSpots(city)
      .then((spots) => {
        let filteredSpots = spots;
        // 만약 queryDistance(사용자가 입력한 km)가 있다면,
        // 각 관광지의 좌표(spot.mapx, spot.mapy 또는 spot.lat, spot.lng)를 사용하여 사용자의 위치와의 거리를 계산하고
        // 해당 거리가 queryDistance 이내인 데이터만 남깁니다.
        if (queryDistance && userLocation) {
          filteredSpots = spots.filter((spot) => {
            // API 데이터에 좌표 정보가 포함되어 있어야 합니다.
            // 예를 들어, item.mapy, item.mapx 또는 item.lat, item.lng
            const spotLat = Number(spot.mapy || spot.lat);
            const spotLng = Number(spot.mapx || spot.lng);
            if (!spotLat || !spotLng) return false;
            const dist = calculateDistance(userLocation.lat, userLocation.lng, spotLat, spotLng);
            return dist <= queryDistance;
          });
        }
        setTourSpots(filteredSpots);
        setCurrentPage(1); // 데이터 갱신 시 페이지 초기화
        setLoading(false);
      })
      .catch((error) => {
        console.error("여행지 정보를 가져오는데 실패했습니다:", error);
        setTourSpots([]);
        setLoading(false);
      });
  }, [selectedCity, queryDistance, userLocation]);

  // 지역 리스트에서 도시 선택 시 처리: 지도 중심 좌표와 선택한 도시를 업데이트합니다.
  const handleCitySelect = (cityName, cityCoord) => {
    setSelectedCity(cityName);
    setCoordinates({
      lat: cityCoord.lat,
      lng: cityCoord.lng,
    });
  };

  // 페이지네이션을 위해 현재 페이지에 해당하는 항목만 추출
  const paginatedSpots = paginate(tourSpots, currentPage, itemsPerPage);

  return (
    <Container fluid className="p-0">
      {/* 헤더 영역 */}
      <Row className="m-0">
        <Col className="p-0">
          <div className="bg-light p-3">
            <h2 className="mb-0">Matnavi</h2>
          </div>
        </Col>
      </Row>

      {/* 지도와 지역 리스트 영역 */}
      <Row className="m-0">
        {/* 지도 영역 (왼쪽) */}
        <Col md={6} className="p-2">
          <div style={{ height: "250px" }}>
            <DestinationMap lat={coordinates.lat} lng={coordinates.lng} />
          </div>
        </Col>

        {/* 지역 리스트 영역 (오른쪽) */}
        <Col md={6} className="p-2">
          <h4>지역 리스트</h4>
          <CityList
            userLocation={userLocation}
            onCitySelect={handleCitySelect}
            selectedCity={selectedCity}
            distanceFilter={queryDistance} // 필요시 거리 정보를 전달하여 리스트 내 표시나 필터링에 활용
          />

          <div className="d-flex justify-content-end mt-2">
            <Form.Select style={{ width: "120px" }}>
              <option>거리순</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* 관광지 정보 목록 영역 */}
      <Row className="m-0">
        <Col className="p-2">
          <div className="border-top pt-4">
            {loading ? (
              <div className="text-center p-5">
                <span className="spinner-border" role="status"></span>
                <p className="mt-2">여행지 정보를 불러오는 중...</p>
              </div>
            ) : tourSpots.length > 0 ? (
              paginatedSpots.map((spot) => (
                <TourImage
                  key={spot.id}
                  spotName={spot.name}
                  description={spot.description}
                />
              ))
            ) : (
              <p className="text-center">
                {selectedCity || queryDistance
                  ? "해당 조건에 맞는 여행지 정보가 없습니다."
                  : "지역을 선택하거나 거리를 입력하면 여행지 정보가 표시됩니다."}
              </p>
            )}
          </div>
        </Col>
      </Row>

      {/* 동적 페이지네이션 */}
      {tourSpots.length > itemsPerPage && (
        <Row className="m-0 mb-4">
          <Col className="d-flex justify-content-center">
            <PaginationComponent
              totalItems={tourSpots.length}
              itemsPerPage={itemsPerPage}
              activePage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
