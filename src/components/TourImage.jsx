// TourImage.jsx
import React, { useEffect, useState } from "react";
import { getImage } from "../api/API";

// 전역 캐시: 동일 spotName에 대해 이미 요청한 결과를 저장
const imageCache = {};

// API 호출 실패 시 사용할 기본 이미지 URL (원하는 이미지로 교체 가능)
const fallbackImage = "https://via.placeholder.com/300?text=No+Image";

const TourImage = ({ spotName}) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!spotName) return;

    // 캐시가 있으면 바로 사용
    if (imageCache[spotName]) {
      setImageUrl(imageCache[spotName]);
      return;
    }

    let isMounted = true;
    getImage(spotName)
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          const url = data.items[0].link; // API 응답 구조에 맞게 조정
          imageCache[spotName] = url;
          if (isMounted) setImageUrl(url);
        } else {
          throw new Error("No image data");
        }
      })
      .catch((error) => {
        console.error("이미지 로딩 실패:", spotName, error);
        // 실패 시 fallback 이미지 사용하고, 캐시에 저장하여 반복 호출 방지
        imageCache[spotName] = fallbackImage;
        if (isMounted) setImageUrl(fallbackImage);
      });
    return () => {
      isMounted = false;
    };
  }, [spotName]);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt={spotName} style={{ width: "100%" }} />
      ) : (
        <p>이미지 로딩중...</p>
      )}
    </div>
  );
};

// props가 변하지 않으면 재렌더링을 막기 위해 React.memo 적용
export default React.memo(TourImage);
