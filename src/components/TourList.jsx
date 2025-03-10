// src/components/TourList.jsx

import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginationComponent from "./PaginationComponent";
import { getTouristAttractions, getCoordinates } from "../api/API";
import { calculateDistance, getCurrentLocation, retryGetCoordinates } from "../api/Location";
import { paginate } from "../utils/Pagination";

const TourList = ({ areaCode }) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [travelList, setTravelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('정렬');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userLocation, setUserLocation] = useState(null);

  // 지역 입력 후 관광지 가져오기
  const handleLocationChange = async () => {
    if (!searchLocation.trim()) return;
    setLoading(true);
    try {
      const location = await getCoordinates(searchLocation);
      if (!location) throw new Error("좌표를 가져올 수 없습니다.");
      const { lat, lng } = location;

      // contentTypeId 12, 14, 15로 필터링하여 가져오기
      const contentTypeIds = [12, 14, 15];
      let combinedData = [];

      for (const id of contentTypeIds) {
        const attractions = await getTouristAttractions(lat, lng, id);
        combinedData = combinedData.concat(attractions);
      }

      setTravelList(combinedData);
      setSortOption("정렬");
    } catch (error) {
      console.error("여행지 정보를 가져오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation((location) => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  // 여행지 거리 계산 (좌표 없는 경우 한 번만 시도)
  useEffect(() => {
    const updateDistances = async () => {
      if (userLocation && travelList.length > 0) {
        const updatedItems = await Promise.all(
          travelList.map(async (place) => {
            if (place.distance && place.distance !== "계산 중...") return place;
  
            if (place.mapX && place.mapY) {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, Number(place.mapY), Number(place.mapX));
              return { ...place, distance: isNaN(distance) ? "계산 실패" : `${distance}` };
            } else {
              const coord = await retryGetCoordinates(place.addr1);
              if (coord) {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, Number(coord.lat), Number(coord.lng));
                return { ...place, distance: isNaN(distance) ? "계산 실패" : `${distance}` };
              }
              return { ...place, distance: "주소 변환 실패" };
            }
          })
        );
  
        setTravelList((prevList) => {
          const hasChanges = JSON.stringify(prevList) !== JSON.stringify(updatedItems);
          return hasChanges ? updatedItems : prevList;
        });
      }
    };
  
    updateDistances();
  }, [userLocation, travelList]);

  // 정렬 로직
  useEffect(() => {
    let sortedList = [...travelList];
    switch (sortOption) {
      case '별점순':
        sortedList.sort((a, b) => b.rating - a.rating);
        break;
      case '거리순':
        sortedList.sort((a, b) => {
          const distanceA = parseFloat(a.distance);
          const distanceB = parseFloat(b.distance);
          return (isNaN(distanceA) ? Infinity : distanceA) - (isNaN(distanceB) ? Infinity : distanceB);
        });
        break;
      default:
        break;
    }
    setTravelList(sortedList);
  }, [sortOption]);

  const currentItems = paginate(travelList, currentPage, itemsPerPage);

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="도시명을 입력해주세요"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            style={{ maxWidth: '200px', minWidth: '180px' }}
          />
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleLocationChange}>변경</Button>
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
          <Link to={`/travel/${item.contentid}`} key={item.contentid} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Row className="border p-3 mb-2">
              <Col xs={3} md={2}>
                <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                  여행지 사진
                </div>
              </Col>
              <Col>
                <h5>{item.title}</h5>
                <p>주소: {item.addr1}</p>
                <p>거리: {item.distance ? `${item.distance} km` : "계산 중..."}</p>
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
