//src/UI/pages/RegionalPage.jsx


import React from 'react';
import { Container, Navbar, Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';

function RegionalPage() {
    return (
        <>
            {/* Header */}
            <header>
                <Navbar bg="light" variant="light">
                    <Container>
                        <Navbar.Brand href="/">Matnavi</Navbar.Brand>
                    </Container>
                </Navbar>
            </header>
        
            {/* Main */}
            <main>
        <Container className="my-4">
          {/* 지역 선택 & 거리순 정렬 */}
          <Row className="align-items-center mb-3">
            <Col xs="auto">
              <strong>선택 지역 :</strong>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="예: 서울, 부산 등"
                style={{ minWidth: '150px' }}
              />
            </Col>
            <Col xs="auto">
              <Button variant="primary">변경</Button>
            </Col>
            <Col xs="auto">
              <Form.Select style={{ minWidth: '120px' }}>
                <option>거리순</option>
                <option>가까운 순</option>
                <option>먼 순</option>
              </Form.Select>
            </Col>
          </Row>

          {/* 여행지 목록 (가로로 긴 리스트 형태) */}
          <Row className="border p-3 mb-2">
            <Col xs={3} md={2}>
              {/* 실제로는 이미지 태그 <img> 등을 사용 */}
              <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                여행지 사진
              </div>
            </Col>
            <Col>
              <h5>여행지 이름</h5>
              <p>여행지 설명 여행지 설명 여행지 설명 여행지 설명</p>
            </Col>
          </Row>
          <Row className="border p-3 mb-2">
            <Col xs={3} md={2}>
              <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                여행지 사진
              </div>
            </Col>
            <Col>
              <h5>여행지 이름</h5>
              <p>여행지 설명 여행지 설명 여행지 설명 여행지 설명</p>
            </Col>
          </Row>
          {/* ...데이터 개수만큼 반복... */}

          {/* 페이지네이션 */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Container>
      </main>
        


        </>
    )
}

export default RegionalPage;