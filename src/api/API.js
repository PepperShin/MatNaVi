// src/api/API.js


// 한국관광공사 API - 관광지 정보 조회
const TOUR_API_BASE_URL = "http://apis.data.go.kr/B551011/KorService1";
const apiKey = import.meta.env.VITE_TOUR_ENCODING_KEY;

// 관광지 정보 조회 함수
export async function getTouristAttractions(lat, lng, contentTypeId, regionName) {
  const url = `${TOUR_API_BASE_URL}/locationBasedList1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=TestApp&mapX=${lng}&mapY=${lat}&radius=10000&numOfRows=1000&contentTypeId=${contentTypeId}&_type=json`;

  console.log("✅ 관광지 API 요청 URL:", url);
  console.log("✅ 필터링할 지역명:", regionName);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`❌ API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ 가져온 관광지 데이터:", data);

    const attractions = data?.response?.body?.items?.item || [];

    const filteredAttractions = attractions.filter((item) =>
      item.addr1 && item.addr1.includes(regionName)
    );

    console.log("✅ 필터링된 관광지 데이터:", filteredAttractions);

    return filteredAttractions;
  } catch (error) {
    console.error("❌ 관광지 정보 가져오기 실패:", error);
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

