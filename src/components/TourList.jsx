// src/components/TourList.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { fetchTouristSpots } from "../api/TourismApi.js";
import { getCoordinatesByAddress } from "../api/NaverApi.js";
import { calculateDynamicDensity } from "../utils/Density";
import PaginationComponent from "./PaginationComponent";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { paginate } from "../utils/Pagination";
import { calculateDistance, getCurrentLocation } from "../api/Location.js";
import { getCachedCoordinate, setCachedCoordinate } from "../utils/CoordinateCache";

const TourList = ({ areaName }) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [travelList, setTravelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    console.log("✅ 업데이트된 travelList:", travelList);
  }, [travelList]);

  useEffect(() => {
    getCurrentLocation((location) => {
      if (location) setUserLocation(location);
    });
  }, []);

  const fetchTouristData = async (locationName) => {
    setLoading(true);
    hasCalculatedDistance.current = false;

    try {
      const location = await getCoordinatesByAddress(locationName);
      if (!location) throw new Error("좌표를 가져올 수 없습니다.");

      const { lat, lng } = location;
      const combinedData = await fetchTouristSpots(lat, lng);

      const densityData = await calculateDynamicDensity(combinedData);
      console.log("✅ 밀집도 데이터:", densityData);

      setTravelList(densityData);
    } catch (error) {
      console.error("❌ 관광지 가져오기 실패:", error);
      setTravelList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (areaName) fetchTouristData(areaName);
  }, [areaName]);

  const handleLocationChange = () => {
    if (searchLocation.trim()) {
      setSortOption("정렬");
      fetchTouristData(searchLocation);
    }
  };

  const hasCalculatedDistance = useRef(false);

  useEffect(() => {
    const updateDistances = async () => {
      if (!userLocation || travelList.length === 0 || hasCalculatedDistance.current) return;

      const updatedItems = await Promise.all(
        travelList.map(async (place) => {
          if (place.distance && place.distance !== "계산 중...") return place;

          let lat = Number(place.mapy) || Number(place.mapY);
          let lng = Number(place.mapx) || Number(place.mapX);

          if (!lat || !lng || lat === 0 || isNaN(lat) || isNaN(lng)) {
            const cached = getCachedCoordinate(place.addr1);
            if (cached) {
              ({ lat, lng } = cached);
            } else {
              const coord = await getCoordinatesByAddress(place.addr1);
              if (coord && coord.lat !== 0 && coord.lng !== 0) {
                lat = Number(coord.lat);
                lng = Number(coord.lng);
                setCachedCoordinate(place.addr1, coord);
              } else {
                return { ...place, distance: "주소 변환 실패" };
              }
            }
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
  }, [areaName]);

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

  const currentItems = useMemo(
    () => paginate(sortedList, currentPage, itemsPerPage),
    [sortedList, currentPage]
  );

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
          <Link
            to={`/travel/${item.contentid}`}
            key={item.contentid}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Row className="border p-3 mb-2">
              <Col xs={3} md={2}>
                <div
                  className="bg-secondary text-white d-flex align-items-center justify-content-center"
                  style={{ height: "100px" }}
                >
                  여행지 사진
                </div>
              </Col>
              <Col>
                <h5>{item.title}</h5>
                <p>주소: {item.addr1}</p>
                <p>
                  거리:{" "}
                  {item.distance && !["계산 실패", "주소 변환 실패"].includes(item.distance)
                    ? `${item.distance} km`
                    : item.distance || "계산 중..."}
                </p>
                <p>
                  밀집도: {item.density !== undefined ? item.density : "계산 중..."} (반경:{" "}
                  {item.radius} km)
                </p>
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
