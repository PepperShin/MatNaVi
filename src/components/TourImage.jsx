// src/components/TourImage.jsx
// 여행지 대표사진 구글 검색 API를 이용해 가져오기 -> vite.config.js에 검색엔진 설정
// .env 에 API 키와 검색 엔진 ID를 저장하고 import.meta.env로 불러옴

import { useState, useEffect } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";

export default function TourImage({ spotName, description }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (spotName) {
      fetchTourImage(spotName);
    }
  }, [spotName]);

  const fetchTourImage = async (name) => {
    setLoading(true);
    try {
      // 환경 변수에서 API 키와 검색 엔진 ID를 불러옵니다.
      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 지연

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(
          name + " 사진"
        )}&searchType=image&num=3`
      );

      if (!response.ok) {
        throw new Error("이미지를 불러오는데 문제가 발생했습니다");
      }

      const data = await response.json();
      // console.log(data)

      if (data.items && data.items.length > 0) {
        const validImage = data.items.find(item => item.link.startsWith('http'));
        setImageUrl(validImage ? validImage.link : "/placeholder-image.jpg");
      } else {
        setImageUrl("/placeholder-image.jpg");
      }
    } catch (err) {
      console.error("이미지 검색 오류:", err);
      setError(err.message);
      setImageUrl("/placeholder-image.jpg");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageUrl("/placeholder-image.jpg");
  };

  return (
    <Row>
        <Col md={12}>
            <Card className="mb-3 p-0 border-0">
            {loading ? (
                <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "300px" }}
                >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">로딩 중...</span>
                </Spinner>
                </div>
            ) : (
                <Card.Img
                variant="top"
                src={imageUrl}
                alt={`${spotName} 대표 이미지`}
                style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    display: "block",
                }}
                onError={handleImageError}
                />
            )}
            </Card>
        </Col>
    </Row>
  );
}