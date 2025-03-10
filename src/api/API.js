// src/api/API.js

import axios from 'axios';

// 한국관광공사 API - 관광지 정보 조회
const TOUR_API_BASE_URL = "http://apis.data.go.kr/B551011/KorService1";

export async function getTouristAttractions(lat, lng, contentTypeId) {
    const apiKey = import.meta.env.VITE_TOUR_DECODING_KEY;  // API 키 가져오기
    const encodedApiKey = encodeURIComponent(apiKey); // API 키 인코딩

    // 출력할 여행지 개수
    const length = 50
    const url = `${TOUR_API_BASE_URL}/locationBasedList1?serviceKey=${encodedApiKey}&numOfRows=${length}&pageNo=1&MobileOS=ETC&MobileApp=TestApp&arrange=A&mapX=${lng}&mapY=${lat}&radius=5000&contentTypeId=${contentTypeId}&_type=json`;
    console.log("관광지 API 요청 URL:", url); // 요청 URL 확인용 로그

    try {
        const response = await fetch(url);
        const data = await response.json(); // JSON 변환
        //console.log("관광지 API 응답 데이터:", data);
        return data.response.body.items.item || []; // API 응답에서 실제 데이터 추출
    } catch (error) {
        console.error("관광지 정보 가져오기 실패:", error);
        return [];
    }
}

  

// 네이버 지도 API - 주소 → 좌표 변환 (지오코딩)
export async function getCoordinates(query) {
  //console.log(`🔍 지역 좌표 검색 시작: ${query}`); // 🛠 콘솔 확인용 로그

  try {
    const response = await fetch(`/naver-api/map-geocode/v2/geocode?query=${query}`, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': import.meta.env.VITE_NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': import.meta.env.VITE_NAVER_CLIENT_SECRET,
      },
    });

    const data = await response.json();
    //console.log("📍 네이버 지도 API 응답 데이터:", data);

    if (data.addresses && data.addresses.length > 0) {
      return {
        lat: data.addresses[0].y,
        lng: data.addresses[0].x,
      };
    } else {
      console.warn("❌ 주소 검색 결과 없음:", query);
      return null; // 좌표 변환 실패 시 null 반환
    }
  } catch (error) {
    console.error("❌ 네이버 지도 API 요청 실패:", error);
    return null; // 오류 발생 시 null 반환
  }
}