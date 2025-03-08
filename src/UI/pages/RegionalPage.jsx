//src/UI/pages/RegionalPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Navbar, Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../components/PaginationComponent';
import Header from '../../components/Header';

function RegionalPage() {
  // 여행지 목록 객체 배열 세팅 -> axios.get() 등으로 서버에서 받아올 예정
  const [travelList, setTravelList] = useState([
    { id: 1, name: '장소 A', rating: 4.5, distance: 10, density: 20 },
    { id: 2, name: '장소 B', rating: 3.2, distance: 5, density: 10 },
    { id: 3, name: '장소 C', rating: 4.8, distance: 15, density: 30 },
    { id: 4, name: '장소 D', rating: 3.7, distance: 20, density: 25 },
    { id: 5, name: '장소 E', rating: 4.1, distance: 8, density: 15 },
    { id: 6, name: '장소 F', rating: 4.9, distance: 12, density: 35 },
    { id: 7, name: '장소 G', rating: 3.5, distance: 7, density: 18 },
    { id: 8, name: '장소 H', rating: 4.2, distance: 14, density: 22 },
    { id: 9, name: '장소 I', rating: 4.0, distance: 9, density: 27 },
    { id: 10, name: '장소 J', rating: 3.8, distance: 11, density: 19 },
    { id: 11, name: '장소 K', rating: 4.3, distance: 6, density: 23 },
    { id: 12, name: '장소 L', rating: 4.6, distance: 13, density: 28 },
    { id: 13, name: '장소 M', rating: 3.6, distance: 16, density: 24 },
    // 필요하면 더 추가 가능
  ]);

  {/* 정렬 */}
  const [sortOption, setSortOption] = useState('별점순');

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
              placeholder="도시명을 입력해주세요 / 예: 서울, 부산 등..."
              className="w-auto w-md-100"
              style={{ maxWidth: '200px', minWidth: '180px', flexGrow: 1 }}
            />
            <Button variant="secondary">변경</Button>
          </Col>

          {/* 정렬 옵션 셀렉트 박스 */}
          <Col xs="auto" className="ms-md-auto mt-2 mt-md-0">
            <Form.Select
              style={{ minWidth: '120px' }}
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="별점순">별점순</option>
              <option value="거리순">거리순</option>
              <option value="여행지 밀집도 순">여행지 밀집도 순</option>
            </Form.Select>
          </Col>
        </Row>

        {/* 여행지 목록 표시 (정렬 결과 반영) */}
        {currentItems.map((item) => (
          <Link 
          to={`/travel/${item.id}`} 
          key={item.id} 
          style={{ textDecoration: 'none', color: 'inherit' }}>
            <Row key={item.id} className="border p-3 mb-2">
            <Col xs={3} md={2}>
              <div
                className="bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ height: '100px' }}
              >
                여행지 사진 // 여행지 사진은 크롤링으로 가져올 예정
              </div>
            </Col>
            <Col>
              <h5>{item.name}</h5>
              <p>
                별점(별 5개 만점으로 표현 방법 검색 필요): {item.rating} / 거리: {item.distance}km / 밀집도: {item.density}
              </p>
            </Col>
          </Row>
          </Link>
        ))}

        <PaginationComponent totalItems={totalItems} onPageChange={handlePageChange} />
        
      </Container>
    </>
  );

}

export default RegionalPage;