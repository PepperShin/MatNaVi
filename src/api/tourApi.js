// src/api/tourApi.js
// 한국관광공사 API를 활용한 여행지 정보 가져오기

export async function fetchTourSpots(areaName) {
    try {
      const apiKey = import.meta.env.VITE_TOUR_INFO_API_KEY;
      const areaCode = getAreaCode(areaName);
  
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&areaCode=${areaCode}&contentTypeId=12`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );
  
      if (!response.ok) {
        throw new Error("관광지 정보를 가져오는데 실패했습니다");
      }
  
      const data = await response.json();
  
      if (data.response && data.response.body && data.response.body.items) {
        return data.response.body.items.item.map((item) => ({
          id: item.contentid,
          name: item.title,
          description: item.overview || "상세 정보가 없습니다.",
          address: item.addr1,
          imageUrl: item.firstimage || null,
        }));
      }
  
      return [];
    } catch (error) {
      console.error("관광지 정보 API 오류:", error);
      return [];
    }
  }
  
  // 지역명을 지역코드로 변환하는 유틸리티 함수
  function getAreaCode(areaName) {
    const areaCodes = {
      "서울": 1,
      "인천": 2,
      "대전": 3,
      "대구": 4,
      "광주": 5,
      "부산": 6,
      "울산": 7,
      "세종": 8,
      "경기": 31,
      "강원": 32,
      "충북": 33,
      "충남": 34,
      "경북": 35,
      "경남": 36,
      "전북": 37,
      "전남": 38,
      "제주": 39,
    };
  
    return areaCodes[areaName] || 1;
  }
  