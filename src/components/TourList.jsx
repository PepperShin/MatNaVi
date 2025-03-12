// src/components/TourList.jsx

import { useState, useEffect, useMemo, useRef  } from "react";
import { getTouristAttractions, getCoordinatesByAddress } from "../api/API";
import { calculateDynamicDensity } from "../utils/Density";
import PaginationComponent from "./PaginationComponent";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { paginate } from "../utils/Pagination.js";
import { calculateDistance, getCurrentLocation } from "../api/Location.js";

const coordinateCache = {}; // 좌표 캐싱

const TourList = ({ areaName }) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [travelList, setTravelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userLocation, setUserLocation] = useState(null);

  // 디버깅용 setTravelList 호출 직후 확인용
  
  useEffect(() => {
    console.log("✅ 업데이트된 travelList:", travelList);
  }, [travelList]);
  

  //  사용자 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation((location) => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  //  지역명으로 관광지 데이터 가져오기
  const fetchTouristData = async (locationName) => {
    setLoading(true);
    try {
      const location = await getCoordinatesByAddress(locationName);
      console.log("좌표 변환 결과:", location);
      if (!location) throw new Error("좌표를 가져올 수 없습니다.");

      const { lat, lng } = location;
      const contentTypeIds = [12, 14, 15];
      let combinedData = [];

      for (const id of contentTypeIds) {
        const attractions = await getTouristAttractions(lat, lng, id);
        combinedData = combinedData.concat(attractions);
      }
      console.log("최종 관광지 데이터:", combinedData);

      const densityData = await calculateDynamicDensity(combinedData);
      console.log("밀집도 데이터:", densityData);

      // 밀집도 데이터가 있는 경우만 업데이트
      if (densityData && densityData.length > 0) {
        setTravelList(densityData);
      }
    } catch (error) {
      console.error("❌ 관광지 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  //  페이지 로드 시 초기 데이터 가져오기
  useEffect(() => {
    if (areaName) {
      fetchTouristData(areaName);
    }
  }, [areaName]);

  //  검색 후 지역 변경 처리
  const handleLocationChange = () => {
    if (searchLocation.trim()) {
      fetchTouristData(searchLocation);
    }
  };

  //  사용자 위치로 거리 계산 (좌표 캐싱 적용)
// 거리 계산 실행 여부를 관리할 useRef 추가
const hasCalculatedDistance = useRef(false);

useEffect(() => {
    const updateDistances = async () => {
        if (!userLocation || travelList.length === 0 || hasCalculatedDistance.current) return;

        const updatedItems = await Promise.all(
            travelList.map(async (place) => {
                if (place.distance && place.distance !== "계산 중...") return place;

                let lat = Number(place.mapy) || Number(place.mapY);
                let lng = Number(place.mapx) || Number(place.mapX);

                if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                    if (coordinateCache[place.addr1]) {
                        ({ lat, lng } = coordinateCache[place.addr1]);
                    } else {
                        const coord = await getCoordinatesByAddress(place.addr1);
                        if (coord) {
                            lat = Number(coord.lat);
                            lng = Number(coord.lng);
                            coordinateCache[place.addr1] = coord;
                        }
                    }
                }

                if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
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
                    distance: isNaN(distance) ? "계산 실패" : `${distance}`,
                };
            })
        );

        setTravelList(updatedItems);
        hasCalculatedDistance.current = true; // 한 번만 실행하도록 설정
    };

    updateDistances();
}, [userLocation, travelList.length]); 

  //  정렬
  const sortedList = useMemo(() => {
    let sorted = [...travelList];
    switch (sortOption) {
      case "별점순":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "거리순":
        sorted.sort((a, b) => {
          const distanceA = parseFloat(a.distance);
          const distanceB = parseFloat(b.distance);
          return (isNaN(distanceA) ? Infinity : distanceA) - (isNaN(distanceB) ? Infinity : distanceB);
        });
        break;
      case "여행지 밀집도순":
        sorted.sort((a, b) => b.density - a.density);
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
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="도시명을 입력해주세요"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            style={{ maxWidth: "200px", minWidth: "180px" }}
          />
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleLocationChange}>
            변경
          </Button>
        </Col>
        <Col xs="auto" className="ms-md-auto">
          <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="정렬">정렬</option>
            <option value="별점순">별점순</option>
            <option value="거리순">거리순</option>
            <option value="여행지 밀집도순">여행지 밀집도순</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        currentItems.map((item) => (
          <Link to={`/travel/${item.contentid}`} key={item.contentid} style={{ textDecoration: "none", color: "inherit" }}>
            <Row className="border p-3 mb-2">
              <Col xs={3} md={2}>
                <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: "100px" }}>
                  여행지 사진
                </div>
              </Col>
              <Col>
                <h5>{item.title}</h5>
                <p>주소: {item.addr1}</p>
                <p>거리: {item.distance !== null ? `${item.distance} km` : "계산 중..."}</p>
                <p>밀집도: {item.density !== undefined ? item.density : "계산 중..."} (반경: {item.radius} km)</p>

              </Col>
            </Row>
          </Link>
        ))
      )}
      <PaginationComponent totalItems={travelList.length} onPageChange={setCurrentPage} />
    </>
  );
};

export default TourList;
