// src/UI/pages/DistancePage.jsx
import React, { useState, useEffect } from 'react';
import PaginationComponent from '../../components/PaginationComponent';
import Header from '../../components/Header';

import {
  Container,
  Navbar,
  Row,
  Col,
  Form,
  ListGroup,
  Pagination,
  Card
} from 'react-bootstrap';

function DistancePage() {
  // 예시 데이터: 실제 구현에서는 API 호출이나 크롤링을 통해 데이터를 받아올 수 있음
  const sampleTravelList = [
    { id: 1, name: '여행지 A', distance: 2.3, rating: 4.5, density: 12, description: '여행지 A 설명' },
    { id: 2, name: '여행지 B', distance: 1.1, rating: 3.8, density: 8,  description: '여행지 B 설명' },
    { id: 3, name: '여행지 C', distance: 3.2, rating: 4.9, density: 20, description: '여행지 C 설명' },
    { id: 4, name: '여행지 D', distance: 0.9, rating: 4.2, density: 15, description: '여행지 D 설명' }
  ];

  // travelList 상태: 실제 데이터로 대체 가능
  const [travelList, setTravelList] = useState(sampleTravelList);
  // 정렬 옵션 상태: 기본은 거리순
  const [sortOption, setSortOption] = useState('거리순');

  // sortOption 변경 시 travelList를 정렬하는 useEffect
  useEffect(() => {
    let sortedList = [...travelList];
    if (sortOption === '거리순') {
      // 현재 위치에서 가까운 순 (오름차순)
      sortedList.sort((a, b) => a.distance - b.distance);
    } else if (sortOption === '별점순') {
      // 외부 웹에서 가져온 별점 데이터 (내림차순)
      sortedList.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === '밀집도순') {
      // 단위원 반경 내 여행지 밀집도 (내림차순)
      sortedList.sort((a, b) => b.density - a.density);
    }
    setTravelList(sortedList);
  }, [sortOption, travelList]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
const itemsPerPage = 5; // 한 페이지에 5개 표시

const totalItems = travelList.length; // 전체 여행지 개수

// 현재 페이지에서 보여줄 데이터 슬라이싱
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = travelList.slice(indexOfFirstItem, indexOfLastItem);

// 페이지 변경 함수
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main */}
      <main>
        <Container className="my-4">
          {/* 지도 영역 및 우측 지역 리스트, 정렬 옵션 */}
          <Row className="mb-4">
            {/* 지도 영역 */}
            <Col md={8}>
              <div
                className="bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ height: '350px' }}
              >
                지도 영역
              </div>
            </Col>
            {/* 우측 지역 리스트 및 정렬 옵션 */}
            <Col md={4}>
              <h5>지역 리스트</h5>
              <ListGroup className="mb-3">
                <ListGroup.Item>지역1</ListGroup.Item>
                <ListGroup.Item>지역2</ListGroup.Item>
                <ListGroup.Item>지역3</ListGroup.Item>
              </ListGroup>
              <Form.Group controlId="sortingOptions">
                <Form.Label>정렬 옵션</Form.Label>
                <Form.Select
                  style={{ minWidth: '120px' }}
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="거리순">거리순</option>
                  <option value="별점순">별점순</option>
                  <option value="밀집도순">밀집도순</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Travel destination List */}
          <Row>
            {currentItems.map((item) => (
              <Col key={item.id} md={12} className="mb-3">
                <Card>
                  <Card.Body className="d-flex">
                    <div
                      className="bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                      style={{ width: '100px', height: '100px' }}
                    >
                      여행지 사진
                    </div>
                    <div>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description} <br />
                        거리: {item.distance} km | 별점: {item.rating} | 밀집도: {item.density}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>


          {/* Pagination */}
          <PaginationComponent totalItems={totalItems} onPageChange={handlePageChange} />
          
        </Container>
      </main>

    
    </>
  );
}

export default DistancePage;
