// src/UI/pages/DistancePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import DestinationMap from "../../components/DestinationMap";
import CityList from "../../components/CityList";
import TourImage from "../../components/TourImage";
import { getCurrentLocation, calculateDistance } from "../../api/Location";
import { fetchTourSpots } from "../../api/API";
import { paginate } from "../../utils/Pagination";
import PaginationComponent from "../../components/PaginationComponent";
import { calculateDynamicDensity } from "../../utils/Density";

function DistancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};
  const initialDistance = parseFloat(stateData.distance) || 50;
  const distanceOptions = [10, 30, 50, 100, 200];
  const initialIndex =
    distanceOptions.indexOf(initialDistance) !== -1
      ? distanceOptions.indexOf(initialDistance)
      : 2;
  const [distanceIndex, setDistanceIndex] = useState(initialIndex);
  const distance = distanceOptions[distanceIndex];

  // 기본 선택값을 "종로구" (서울특별시의 유효한 구)로 설정
  const [selectedCity, setSelectedCity] = useState("종로구");
  const [userLocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 37.5729, lng: 126.9794 });

  // 관광지 목록 및 UI 상태
  const [tourSpots, setTourSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("거리순");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 사용자 위치 가져오기
  useEffect(() => {
    getCurrentLocation((loc) => {
      if (loc) {
        setUserLocation(loc);
      } else {
        console.error("❌ 사용자 위치를 가져오지 못했습니다.");
      }
    });
  }, []);

  // 관광지 데이터 요청 및 거리, 밀집도 계산
  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    const city = selectedCity || "종로구";
    fetchTourSpots(city)
      .then(async (spots) => {
        // 각 관광지 항목에 대해 사용자 위치와의 거리를 계산하여 추가
        const spotsWithDistance = spots.map((spot) => {
          const spotLat = Number(spot.mapy || spot.lat);
          const spotLng = Number(spot.mapx || spot.lng);
          let computedDistance = "계산 실패";
          if (spotLat && spotLng && !isNaN(spotLat) && !isNaN(spotLng)) {
            computedDistance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              spotLat,
              spotLng
            );
          }
          return { ...spot, distance: computedDistance };
        });

        // 밀집도와 반경 정보를 계산 (비동기)
        const spotsWithDensity = await calculateDynamicDensity(spotsWithDistance);

        // distance 기준 필터링 (업데이트된 distance 값 사용)
        let filteredSpots = spotsWithDensity;
        if (distance && userLocation) {
          filteredSpots = spotsWithDensity.filter((spot) => {
            // distance가 문자열인 경우 필터링하지 않음
            return typeof spot.distance === "number" && spot.distance <= distance;
          });
        }

        setTourSpots(filteredSpots);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 여행지 정보를 가져오는데 실패했습니다:", error);
        setTourSpots([]);
        setLoading(false);
      });
  }, [selectedCity, distance, userLocation]);

  // 정렬된 관광지 리스트 계산
  const sortedList = useMemo(() => {
    let sorted = [...tourSpots];
    switch (sortOption) {

      case "거리순":
        sorted.sort((a, b) => {
          const distA = parseFloat(a.distance) || Infinity;
          const distB = parseFloat(b.distance) || Infinity;
          return distA - distB;
        });
        break;
      case "여행지 밀집도순":
        sorted.sort((a, b) => (b.density || 0) - (a.density || 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [sortOption, tourSpots]);

  // 페이지네이션
  const paginatedSpots = useMemo(
    () => paginate(sortedList, currentPage, itemsPerPage),
    [sortedList, currentPage]
  );

  // CityList에서 도시 선택 시 처리
  const handleCitySelect = (cityName, cityCoord) => {
    setSelectedCity(cityName);
    setCoordinates({ lat: cityCoord.lat, lng: cityCoord.lng });
    setLoading(true);
    fetchTourSpots(cityName)
      .then(async (spots) => {
        const spotsWithDistance = spots.map((spot) => {
          const spotLat = Number(spot.mapy || spot.lat);
          const spotLng = Number(spot.mapx || spot.lng);
          let computedDistance = "계산 실패";
          if (spotLat && spotLng && !isNaN(spotLat) && !isNaN(spotLng)) {
            computedDistance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              spotLat,
              spotLng
            );
          }
          return { ...spot, distance: computedDistance };
        });
        const spotsWithDensity = await calculateDynamicDensity(spotsWithDistance);
        setTourSpots(spotsWithDensity);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 여행지 정보를 가져오는데 실패했습니다:", error);
        setTourSpots([]);
        setLoading(false);
      });
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        {/* 상단 헤더 영역 */}
        <Row className="mb-3 align-items-center">
          <Col>
            <h2>내 주변 {distance}km 이내의 여행지 정보</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => navigate("/")}>
              메인으로 돌아가기
            </Button>
          </Col>
        </Row>

        {/* 지도와 지역 리스트 영역 */}
        <Row className="mb-4">
          {/* 지도 영역 */}
          <Col md={6} className="mb-3 mb-md-0">
            <div
              className="border p-2"
              style={{ height: "300px", boxSizing: "border-box" }}
            >
              <DestinationMap lat={coordinates.lat} lng={coordinates.lng} />
            </div>
          </Col>
          {/* 지역 리스트 영역 */}
          <Col md={6}>
            <div
              className="border p-2"
              style={{
                height: "300px",
                boxSizing: "border-box",
                overflowY: "auto",
              }}
            >
              <h5 className="mb-3">지역 리스트</h5>
              <CityList
                userLocation={userLocation}
                distanceFilter={distance}
                selectedCity={selectedCity}
                onCitySelect={handleCitySelect}
              />
            </div>
          </Col>
        </Row>
        {/* 거리 조정 슬라이더 및 정렬 옵션 */}
        <Row className="mb-3">
          <Col>
            <label>거리 조정: </label>
            <input
              type="range"
              min="0"
              max={distanceOptions.length - 1}
              step="1"
              value={distanceIndex}
              onChange={(e) => setDistanceIndex(Number(e.target.value))}
            />
            <span style={{ marginLeft: "10px" }}>{distance} km</span>
          </Col>
          <Col xs="auto" className="ms-md-auto">
            <Form.Select
              style={{ minWidth: "120px" }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="거리순">거리순</option>
              <option value="여행지 밀집도순">여행지 밀집도순</option>
            </Form.Select>
          </Col>
        </Row>
        {/* 여행지 목록 영역 */}
        <Row>
          <Col>
            {loading ? (
              <div className="text-center p-5">
                <span className="spinner-border" role="status"></span>
                <p className="mt-2">여행지 정보를 불러오는 중...</p>
              </div>
            ) : paginatedSpots.length > 0 ? (
              paginatedSpots.map((item) => (
                <Link
                  to={`/tripinfo/${item.contentid}`}
                  state={location.state}
                  key={item.contentid || item.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Row className="border p-3 mb-2">
                    <Col xs={12} md={4}>
                      <TourImage
                        spotName={item.title || item.name}
                        description={item.overview || "설명 정보가 없습니다."}
                      />
                    </Col>
                    <Col className="d-flex flex-column justify-content-center">
                      <h5 className="mb-3">{item.title || item.name}</h5>
                      <p>주소: {item.addr1}</p>
                      <p>
                        거리:{" "}
                        {typeof item.distance === "number"
                          ? `${item.distance.toFixed(2)}km`
                          : "계산 중..."}
                      </p>
                      <p>
                        밀집도:{" "}
                        {item.density !== undefined
                          ? item.density
                          : "계산 중..."}{" "}
                        (반경: {item.radius} km)
                      </p>
                    </Col>
                  </Row>
                </Link>
              ))
            ) : (
              <p className="text-center">
                {selectedCity || distance
                  ? "해당 조건에 맞는 여행지 정보가 없습니다."
                  : "지역을 선택하거나 거리를 입력하면 여행지 정보가 표시됩니다."}
              </p>
            )}
          </Col>
        </Row>
        {/* 페이지네이션 */}
        {tourSpots.length > itemsPerPage && (
          <Row className="mb-4">
            <Col className="d-flex justify-content-center">
              <PaginationComponent
                totalItems={tourSpots.length}
                onPageChange={setCurrentPage}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default DistancePage;
