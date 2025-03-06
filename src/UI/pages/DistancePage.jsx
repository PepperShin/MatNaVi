//src/UI/pages/DistancePage.jsx

import React from 'react';
import { Container, Navbar, Card, Button } from 'react-bootstrap';

function DistancePage() {
    return(
        <>
        {/* Header */}
        <header>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="/">추천 여행지</Navbar.Brand>
                </Container>
            </Navbar>
        </header>

        {/* Main */}
        <main>
        <Container className="my-4">
          <h2>거리기반 여행지 추천</h2>
          <p>여기에 거리기반 추천 결과를 카드 또는 리스트 형태로 표시합니다.</p>
          <div className="d-flex flex-wrap">
            <Card style={{ width: '18rem' }} className="m-2">
              <Card.Img variant="top" src="https://via.placeholder.com/150" alt="장소 이미지" /> // api에서 이미지 가져오기기
              <Card.Body>
                <Card.Title>장소 이름</Card.Title>
                <Card.Text>
                  간단한 설명이 들어갑니다.
                </Card.Text>
                <Button variant="primary">자세히 보기</Button>
              </Card.Body>
            </Card>
            {/* 추가 카드 컴포넌트를 반복해서 배치 */}
          </div>
        </Container>
      </main>
        </>
    )
}

export default DistancePage;