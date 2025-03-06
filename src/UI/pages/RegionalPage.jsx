//src/UI/pages/RegionalPage.jsx


import React, { useState } from 'react';
import { Container, Navbar, Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';

function RegionalPage() {
  // 여행지 목록 객체 배열 세팅 -> axios.get() 등으로 서버에서 받아올 예정
  const [travelList, setTravelList] = useState([
    { id: 1, name: '장소 A', rating: 4.5, distance: 10, density: 20 },
    { id: 2, name: '장소 B', rating: 3.2, distance: 5,  density: 10 },
    { id: 3, name: '장소 C', rating: 4.8, distance: 15, density: 30 },
    // ...
  ]);

  // 정렬 기준 상태(별점, 거리, 밀집도)
  const [sortOption, setSortOption] = useState('별점순');

  // 정렬 기준이 변경 될 때 실행될 함수
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    let sortedList = [...travelList];

    switch (selectedOption) {
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
  };


   return (
    <Container className="my-4">
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <strong>선택 지역 :</strong>
        </Col>
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="도시명을 입력해주세요 / 예: 서울, 부산 등..."
            style={{ minWidth: '150px' }}
          />
        </Col>
        <Col xs="auto">
          <Button variant="primary">변경</Button>
        </Col>

        {/* 정렬 옵션 셀렉트 박스 */}
        <Col xs="auto">
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
      {travelList.map((item) => (
        <Row key={item.id} className="border p-3 mb-2">
          <Col xs={3} md={2}>
            <div
              className="bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{ height: '80px' }}
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
      ))}
    </Container>
  );

}

export default RegionalPage;