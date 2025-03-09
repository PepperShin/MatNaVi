//src/UI/pages/RegionalPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Navbar, Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../components/PaginationComponent';
import Header from '../../components/Header';
import { getTouristAttractions, getCoordinates } from '../../api/API';
import { getCurrentLocation, getAddressFromCoordinates, calculateDistance, retryGetCoordinates, cleanAddress } from "../../api/Location";

function RegionalPage() {

  const [searchLocation, setSearchLocation] = useState(""); // 입력한 지역명
  const [travelList, setTravelList] = useState([]); // 가져온 여행지 목록
  const [loading, setLoading] = useState(false); // 로딩 상태

    // 지역 변경 버튼 클릭 시 실행될 함수
  const handleLocationChange = async () => {
    if (!searchLocation.trim()) return; // 빈 값 방지
    console.log(`🔍 검색할 지역: ${searchLocation}`);

    setLoading(true); // 로딩 시작

    try {
      // 입력한 지역의 위도, 경도 가져오기
      console.log("지역 입력 값:", searchLocation);
      const location = await getCoordinates(searchLocation);

      if (!location) {
        throw new Error("좌표를 가져올 수 없습니다.");
      }

      //console.log("변환된 좌표:", location);
      const { lat, lng } = location; // 여기서 구조 분해 할당

      const attractions = await getTouristAttractions(lat, lng);
      //console.log("가져온 관광지 목록:", attractions);

      setTravelList(attractions);
      setSortOption("정렬");  // 검색 시 정렬 초기화

    } catch (error) {
      console.error("여행지 정보를 가져오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };


  {/* 정렬 */}
  const [sortOption, setSortOption] = useState('정렬');

  useEffect(() => {
    let sortedList = [...travelList];
  
    switch (sortOption) {
      case '별점순':
        sortedList.sort((a, b) => b.rating - a.rating);
        break;
      case '거리순':
        sortedList.sort((a, b) => a.distance - b.distance);
        break;
      case '여행지 밀집도 순':
        sortedList.sort((a, b) => b.density - a.density);
        break;
      default:
        break;
    }
    setTravelList(sortedList);
  }, [sortOption]); // sortOption이 변경될 때마다 실행됨

  // 정렬 기준이 변경 될 때 실행될 함수
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };


  {/* 페이지네이션 */}
  const totalItems = travelList.length; // 전체 데이터 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 5; // 한 페이지에 5개 표시
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // 현재 페이지의 데이터 슬라이싱
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = travelList.slice(indexOfFirstItem, indexOfLastItem);
  

  // 사용자 위치 - 주소
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  
  // 실패한 주소 저장 (재시도 방지용)
  const [failedAddresses, setFailedAddresses] = useState(new Set());

  // 사용자 위치를 주소로 변환
  useEffect(() => {
    getCurrentLocation(async (location) => {
        if (location) {
            setUserLocation(location);
            console.log("✅ 사용자 위치:", location);

            // 좌표를 주소로 변환
            const address = await getAddressFromCoordinates(location.lat, location.lng);
            setUserAddress(address);
            console.log("📍 변환된 사용자 주소:", address);
        }
    });
}, []);



  // 여행지 데이터를 가져와서 사용자 위치와 거리 계산
  useEffect(() => {
    if (userLocation && travelList.length > 0) {
        const updateDistances = async () => {
            const updatedItems = await Promise.all(
                travelList.map(async (place) => {
                    if (place.distance) return place; // 이미 거리 계산된 경우 다시 계산 안 함

                    if (place.mapX && place.mapY) {
                        // 좌표가 있는 경우 거리 계산
                        const distance = calculateDistance(
                            userLocation.lat, userLocation.lng,
                            Number(place.mapY), Number(place.mapX)
                        );

                        return { ...place, distance: isNaN(distance) ? "계산 실패" : `${distance}` };
                    } 
                    else {
                        // 이미 실패한 주소라면 재시도하지 않음
                        if (failedAddresses.has(place.addr1)) {
                            return { ...place, distance: "주소 변환 실패" };
                        }

                        //console.warn(`🚨 여행지 ${place.title} 좌표 없음, 주소 변환 시도 중...`);
                        const coord = await retryGetCoordinates(place.addr1);
                        
                        if (!coord) {
                            console.warn(`❌ 최종 실패: ${place.addr1}`);
                            setFailedAddresses(prev => new Set(prev).add(place.addr1)); // ❗ 실패한 주소 저장
                            return { ...place, distance: "주소 변환 실패" };
                        }

                        const distance = calculateDistance(
                            userLocation.lat, userLocation.lng,
                            Number(coord.lat), Number(coord.lng)
                        );

                        return { ...place, distance: isNaN(distance) ? "계산 실패" : `${distance}` };
                    }
                })
            );

            // travelList가 변경될 때만 업데이트 (무한 루프 방지)
            setTravelList(prevList => {
              if (JSON.stringify(prevList) !== JSON.stringify(updatedItems)) {
                return updatedItems;
              }
              return prevList;
            });
        };

        updateDistances();
    }
  }, [userLocation, travelList]);  // `userLocation` 또는 `travelList`가 변경될 때 실행


  
   return (
    <>
      <Header />
      <Container className="my-4">
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <strong>선택 지역 :</strong>
          </Col>
          <Col xs="auto" className="d-flex align-items-center gap-2 flex-wrap" style={{ flexGrow: 1 }}>
            <Form.Control
              type="text"
              placeholder="도시명을 입력해주세요"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-auto w-md-100"
              style={{ maxWidth: '200px', minWidth: '180px', flexGrow: 1 }}
            />
            <Button variant="secondary" onClick={handleLocationChange}>변경</Button>
          </Col>

          {/* 정렬 옵션 셀렉트 박스 */}
          <Col xs="auto" className="ms-md-auto mt-2 mt-md-0">
            <Form.Select
              style={{ minWidth: '120px' }}
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="정렬">정렬</option>
              <option value="별점순">별점순</option>
              <option value="거리순">거리순</option>
              <option value="여행지 밀집도 순">여행지 밀집도 순</option>
            </Form.Select>
          </Col>
        </Row>

        {/* 여행지 목록 표시 (정렬 결과 반영) */}
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          currentItems.map((item, index) => (
            <Link to={`/travel/${item.contentid}`} key={item.contentid || index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Row className="border p-3 mb-2">
                <Col xs={3} md={2}>
                  <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                    여행지 사진
                  </div>
                </Col>
                <Col>
                  <h5>{item.title}</h5>
                  <p>주소: {item.addr1}</p>
                  <p>지역 코드: {item.areacode} / 콘텐츠 ID: {item.contentid}</p>
                  <p>거리: {item.distance ? `${item.distance} km` : "계산 중..."}</p>
                  {/*<p>별점: {item.rating} / 거리: {item.distance}km / 밀집도: {item.density}</p>*/}
                </Col>
              </Row>
            </Link>
          ))
        )}

        <PaginationComponent totalItems={totalItems} onPageChange={handlePageChange} />
        
      </Container>
    </>
  );

}

export default RegionalPage;