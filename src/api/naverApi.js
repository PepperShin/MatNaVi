// src/api/naverApi.js
// 네이버 지도 API를 활용한 지도 이미지 가져오기

export async function fetchMapImage(lat, lng, zoom = 14) {
    try {
      const apiKey = import.meta.env.VITE_NAVER_MAP_API_KEY;
      const apiSecret = import.meta.env.VITE_NAVER_MAP_API_SECRET;
  
      // Static Map API URL 생성 (키를 쿼리 파라미터로 포함)
      const mapUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=400&h=300&center=${lng},${lat}&level=${zoom}&scale=2&X-NCP-APIGW-API-KEY-ID=${apiKey}&X-NCP-APIGW-API-KEY=${apiSecret}`;
  
      return mapUrl;
    } catch (error) {
      console.error("네이버 지도 API 오류:", error);
      return null;
    }
  }
  