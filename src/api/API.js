// src/api/API.js

// 한국 관광공사 API에서 사용하는 지역코드와 시군구 코드
const AREA_CODE_MAPPING = {
  "서울특별시": 1,
  "부산광역시": 6,
  "대구광역시": 4,
  "인천광역시": 2,
  "광주광역시": 5,
  "대전광역시": 3,
  "울산광역시": 7,
  "세종특별자치시": 8,
  "경기도": 31,
  "강원도": 32,
  "충청북도": 33,
  "충청남도": 34,
  "경상북도": 35,
  "경상남도": 36,
  "전라북도": 37,
  "전라남도": 38,
  "제주특별자치도": 39
};

const SIGUNGU_CODE_MAPPING = {
  "서울특별시": {
    "강남구": 1,
    "강동구": 2,
    "강북구": 3,
    "강서구": 4,
    "관악구": 5,
    "광진구": 6,
    "구로구": 7,
    "금천구": 8,
    "노원구": 9,
    "도봉구": 10,
    "동대문구": 11,
    "동작구": 12,
    "마포구": 13,
    "서대문구": 14,
    "서초구": 15,
    "성동구": 16,
    "성북구": 17,
    "송파구": 18,
    "양천구": 19,
    "영등포구": 20,
    "용산구": 21,
    "은평구": 22,
    "종로구": 23,
    "중구": 24,
    "중랑구": 25
  },
  "부산광역시": {
    "강서구": 1,
    "금정구": 2,
    "기장군": 3,
    "남구": 4,
    "동구": 5,
    "동래구": 6,
    "부산진구": 7,
    "북구": 8,
    "사상구": 9,
    "사하구": 10,
    "서구": 11,
    "수영구": 12,
    "연제구": 13,
    "영도구": 14,
    "중구": 15,
    "해운대구": 16
  },
  "대구광역시": {
    "남구": 1,
    "달서구": 2,
    "달성군": 3,
    "동구": 4,
    "북구": 5,
    "서구": 6,
    "수성구": 7,
    "중구": 8
  },
  "인천광역시": {
    "중구": 10,
    "동구": 4,
    "미추홀구": 5,
    "연수구": 8,
    "남동구": 3,
    "부평구": 6,
    "계양구": 2,
    "서구": 7,
    "강화군": 1,
    "옹진군": 9
  },
  "광주광역시": {
    "동구": 3,
    "서구": 5,
    "남구": 2,
    "북구": 4,
    "광산구": 1
  },
  "대전광역시": {
    "동구": 2,
    "중구": 5,
    "서구": 3,
    "유성구": 4,
    "대덕구": 1
  },
  "울산광역시": {
    "중구": 5,
    "남구": 1,
    "동구": 2,
    "북구": 3,
    "울주군": 4
  },
  // Location.js에서는 세종특별자치시의 시 이름이 "세종시"로 되어 있음
  "세종특별자치시": {
    "세종시": 1
  },
  "경기도": {
    "가평군": 1,
    "고양시": 2,
    "과천시": 3,
    "광명시": 4,
    "광주시": 5,
    "구리시": 6,
    "군포시": 7,
    "김포시": 8,
    "남양주시": 9,
    "동두천시": 10,
    "부천시": 11,
    "성남시": 12,
    "수원시": 13,
    "시흥시": 14,
    "안산시": 15,
    "안성시": 16,
    "안양시": 17,
    "양주시": 18,
    "양평군": 19,
    "여주시": 20,
    "연천군": 21,
    "오산시": 22,
    "용인시": 23,
    "의왕시": 24,
    "의정부시": 25,
    "이천시": 26,
    "파주시": 27,
    "평택시": 28,
    "포천시": 29,
    "하남시": 30,
    "화성시": 31
  },
  "강원도": {
    "강릉시": 1,
    "고성군": 2,
    "동해시": 3,
    "삼척시": 4,
    "속초시": 5,
    "양구군": 6,
    "양양군": 7,
    "영월군": 8,
    "원주시": 9,
    "인제군": 10,
    "정선군": 11,
    "철원군": 12,
    "춘천시": 13,
    "태백시": 14,
    "평창군": 15,
    "홍천군": 16,
    "화천군": 17,
    "횡성군": 18
  },
  "충청북도": {
    "괴산군": 1,
    "단양군": 2,
    "보은군": 3,
    "영동군": 4,
    "옥천군": 5,
    "음성군": 6,
    "제천시": 7,
    "증평군": 8,
    "진천군": 9,
    "청주시": 10,
    "충주시": 11
  },
  "충청남도": {
    "계룡시": 1,
    "공주시": 2,
    "금산군": 3,
    "논산시": 4,
    "당진시": 5,
    "보령시": 6,
    "부여군": 7,
    "서산시": 8,
    "서천군": 9,
    "아산시": 10,
    "예산군": 11,
    "천안시": 12,
    "청양군": 13,
    "태안군": 14,
    "홍성군": 15
  },
  "전라북도": {
    "고창군": 1,
    "군산시": 2,
    "김제시": 3,
    "남원시": 4,
    "무주군": 5,
    "부안군": 6,
    "순창군": 7,
    "완주군": 8,
    "익산시": 9,
    "임실군": 10,
    "장수군": 11,
    "전주시": 12,
    "정읍시": 13,
    "진안군": 14
  },
  "전라남도": {
    "강진군": 1,
    "고흥군": 2,
    "곡성군": 3,
    "광양시": 4,
    "구례군": 5,
    "나주시": 6,
    "담양군": 7,
    "목포시": 8,
    "무안군": 9,
    "보성군": 10,
    "순천시": 11,
    "신안군": 12,
    "여수시": 13,
    "영광군": 14,
    "영암군": 15,
    "완도군": 16,
    "장성군": 17,
    "장흥군": 18,
    "진도군": 19,
    "함평군": 20,
    "해남군": 21,
    "화순군": 22
  },
  "제주특별자치도": {
    "서귀포시": 1,
    "제주시": 2
  }
};

// 표준화할 province 이름들 정의 (축약된 이름을 정식 이름으로 변환)
const STANDARD_PROVINCES = {
  "부산": "부산광역시",
  "대구": "대구광역시",
  "인천": "인천광역시",
  "광주": "광주광역시",
  "대전": "대전광역시",
  "울산": "울산광역시",
  "세종": "세종특별자치시",
  "제주": "제주특별자치도"
  // 필요에 따라 다른 약칭도 추가 가능
};

// `도 + 시군구`를 `지역코드 + 시군구코드`로 변환하는 함수
export function getAreaAndSigunguCode(province, city) {
  // 전달된 province 값이 표준화 대상이라면 변환
  if (STANDARD_PROVINCES[province]) {
    province = STANDARD_PROVINCES[province];
  }
  
  const areaCode = AREA_CODE_MAPPING[province] || null;
  let sigunguCode = SIGUNGU_CODE_MAPPING[province]?.[city] || null;

  if (!areaCode) {
    console.warn(`❌ ${province}의 지역코드를 찾을 수 없습니다.`);
  }
  if (!sigunguCode) {
    console.warn(`⚠️ ${province} ${city}의 시군구 코드를 찾을 수 없습니다.`);
  }

  // 제주특별자치도의 경우 시군구 코드를 사용하지 않음
  if (province === "제주특별자치도") {
    sigunguCode = null;
  }

  return { areaCode, sigunguCode };
}

// 한국관광공사 API - 관광지 정보 조회
const TOUR_API_BASE_URL = "http://apis.data.go.kr/B551011/KorService1";
const apiKey = import.meta.env.VITE_TOUR_ENCODING_KEY;

// 관광지 정보 조회 함수
export async function getTouristAttractions(areaCode, sigunguCode, contentTypeId) {
  let url = `${TOUR_API_BASE_URL}/areaBasedList1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=TestApp&numOfRows=1000&contentTypeId=${contentTypeId}&_type=json&areaCode=${areaCode}`;

  // sigunguCode가 있을 때만 추가
  if (sigunguCode) {
    url += `&sigunguCode=${sigunguCode}`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`❌ API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    if (!data.response || !data.response.body || !data.response.body.items) {
      console.warn("❌ 관광지 API 응답에 데이터 없음:", data);
      return [];
    }

    return data.response.body.items.item || [];
  } catch (error) {
    console.error("❌ 관광지 정보 가져오기 실패:", error);
    return [];
  }
}

// 네이버 지도 API - 주소 → 좌표 변환 (지오코딩)
export async function getCoordinatesByAddress(province, city) {
  try {
    const query = `${province} ${city}`;
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

    if (!data.addresses || data.addresses.length === 0) {
      console.warn("📍 네이버 API에서 좌표를 찾지 못함:", query);
      return null;
    }

    const matchedAddress = data.addresses.find(addr =>
      addr.roadAddress.includes(city) || addr.jibunAddress.includes(city)
    );

    if (matchedAddress) {
      return {
        lat: parseFloat(matchedAddress.y),
        lng: parseFloat(matchedAddress.x),
      };
    }

    return null;
  } catch (error) {
    console.error("❌ 주소 → 좌표 변환 실패:", error);
    return null;
  }
}

// 수정된 fetchTourSpots 함수
export async function fetchTourSpots(cityName) {
  let areaCode, sigunguCode;
  let found = false;

  // 우선, 시군구 매핑 정보를 이용해 찾는다.
  for (const province in SIGUNGU_CODE_MAPPING) {
    if (SIGUNGU_CODE_MAPPING[province][cityName]) {
      areaCode = AREA_CODE_MAPPING[province];
      sigunguCode = SIGUNGU_CODE_MAPPING[province][cityName];
      found = true;
      break;
    }
  }

  // 만약 시군구 매핑에서 찾지 못했다면, cityName이 province명(예: "서울특별시")일 수 있으므로 처리
  if (!found && AREA_CODE_MAPPING[cityName]) {
    areaCode = AREA_CODE_MAPPING[cityName];
    sigunguCode = null;
    found = true;
  }

  if (!found) {
    console.error("❌ 도시 정보가 없습니다:", cityName);
    return [];
  }

  const contentTypeIds = [12, 14, 15];
  let combinedData = [];

  for (const typeId of contentTypeIds) {
    const attractions = await getTouristAttractions(areaCode, sigunguCode, typeId);
    combinedData = [...combinedData, ...attractions];
  }

  return combinedData;
}
