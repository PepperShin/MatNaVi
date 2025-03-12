// src/api/API.js


// 한국관광공사 API - 관광지 정보 조회
const TOUR_API_BASE_URL = "http://apis.data.go.kr/B551011/KorService1";

export async function getTouristAttractions(lat, lng, contentTypeId) {
    const apiKey = import.meta.env.VITE_TOUR_DECODING_KEY;  // API 키 가져오기
    const encodedApiKey = encodeURIComponent(apiKey); // API 키 인코딩

    const url = `${TOUR_API_BASE_URL}/locationBasedList1?serviceKey=${encodedApiKey}&MobileOS=ETC&MobileApp=TestApp&arrange=A&mapX=${lng}&mapY=${lat}&radius=10000&numOfRows=1000&contentTypeId=${contentTypeId}&_type=json`;
    console.log("관광지 API 요청 URL:", url); // 요청 URL 확인용 로그

    try {
        const response = await fetch(url);
        const data = await response.json(); // JSON 변환

        // 응답 데이터 확인
        console.log("✅ API 응답 데이터:", data);

        // totalCount 값 확인
        console.log("✅ totalCount:", data.response.body.totalCount);

        return data.response.body.items.item || []; // API 응답에서 실제 데이터 추출
    } 
    catch (error) {
        console.error("관광지 정보 가져오기 실패:", error);
        return [];
    }
}

  

// 네이버 지도 API - 주소 → 좌표 변환 (지오코딩)
export async function getCoordinatesByAddress(query) {

  try {
    const response = await fetch(`/naver-api/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      console.error("❌ API 응답 오류:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("API 응답 데이터:", data);
    
    if (data.addresses && data.addresses.length > 0) {
      return {
        lat: data.addresses[0].y,
        lng: data.addresses[0].x,
      };
    } 
    else {
      console.warn("❌ 주소 검색 결과 없음:", query);
      return null; // 좌표 변환 실패 시 null 반환
    }
  } 
  catch (error) {
    console.error("❌ 주소 → 좌표 변환 실패:", query, error);
    return null; // 오류 발생 시 null 반환
  }
}

