// src/components/TourList.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { getTouristAttractions, getAreaAndSigunguCode, getCoordinatesByAddress } from "../api/API";
import PaginationComponent from "./PaginationComponent";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { paginate } from "../utils/Pagination.js";
import { calculateDistance, getCurrentLocation } from "../api/Location.js";
import TourImage from "./TourImage";
import { calculateDynamicDensity } from "../utils/Density";

// 도 리스트
const provinces = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
  "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도",
  "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

// 시군구 리스트 (도 선택 시 연동됨)
const cityData = {
  "서울특별시": ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구",
              "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구",
              "서초구", "강남구", "송파구", "강동구"],

  "부산광역시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구",
               "강서구", "연제구", "수영구", "사상구", "기장군"],

  "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],

  "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],

  "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],

  "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],

  "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],

  "세종특별자치시": ["세종시"],

  "경기도": ["수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시",
           "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시",
           "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],

  "강원도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군",
           "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],

  "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],

  "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시",
           "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],

  "전라북도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군",
           "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],

  "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군",
           "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군",
           "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],

  "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시",
           "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군",
           "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],

  "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군",
           "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],

  "제주특별자치도": ["제주시", "서귀포시"]
};


const TourList = ({ selectedProvince, selectedCity, setSelectedProvince, setSelectedCity }) => {
  
  const [travelList, setTravelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userLocation, setUserLocation] = useState(null);
  const hasCalculatedDistance = useRef(false);

  // 도 선택 변경 시
  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    setSelectedProvince(newProvince);
    setSelectedCity(cityData[newProvince][0]); // 해당 도의 첫 번째 시/군 자동 선택
  };
  
  // 시/군 선택 변경 시
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  useEffect(() => {
    getCurrentLocation((location) => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  // 관광지 정보 가져오기
  const fetchTouristData = async () => {
    setLoading(true);
    try {
      const { areaCode, sigunguCode } = getAreaAndSigunguCode(selectedProvince, selectedCity);
      //console.log("🔍 검색 지역 코드:", areaCode, sigunguCode);
      if (!areaCode) return console.error("❌ 지역코드 없음");
  
      const contentTypeIds = [12, 14, 15];
      let combinedData = [];
  
      // 12, 14, 15 각각에 대해 관광지 데이터 요청
      for (const id of contentTypeIds) {
        const attractions = await getTouristAttractions(areaCode, sigunguCode, id);
        combinedData = combinedData.concat(attractions);
      }
  
      //console.log("✅ 최종 관광지 데이터:", combinedData);
  
      // ✅ 밀집도 계산 적용
      const dataWithDensity = await calculateDynamicDensity(combinedData);
      // console.log("📌 밀집도 계산 완료:", dataWithDensity);
  
      setTravelList(dataWithDensity); // 밀집도 포함된 데이터 저장
  
    } catch (error) {
      console.error("❌ 관광지 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 거리 계산
  useEffect(() => {
    const updateDistances = async () => {
      if (!userLocation || travelList.length === 0 || hasCalculatedDistance.current) return;

      const updatedItems = await Promise.all(
        travelList.map(async (place) => {
          if (place.distance && place.distance !== "계산 중...") return place;

          let lat = Number(place.mapy);
          let lng = Number(place.mapx);

          if (!lat || !lng || lat === 0 || lng === 0 || isNaN(lat) || isNaN(lng)) {
            return { ...place, distance: "주소 변환 실패" };
          }

          const distance = calculateDistance(
            Number(userLocation.lat),
            Number(userLocation.lng),
            lat,
            lng
          );

          return {
            ...place,
            distance: isNaN(distance) ? "계산 실패" : `${distance.toFixed(2)}`,
          };
        })
      );

      setTravelList(updatedItems);
      hasCalculatedDistance.current = true;
    };

    updateDistances();
  }, [userLocation, travelList]);


  useEffect(() => {
    hasCalculatedDistance.current = false;
    fetchTouristData();
  }, [selectedProvince, selectedCity]);  // ✅ useEffect 닫는 부분 수정


  // 정렬
  const sortedList = useMemo(() => {
    let sorted = [...travelList];
    switch (sortOption) {
      case "별점순":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // ✅ rating이 없을 경우 0으로 처리
        break;
      case "거리순":
        sorted.sort((a, b) => {
          const distanceA = parseFloat(a.distance) || Infinity;
          const distanceB = parseFloat(b.distance) || Infinity;
          return distanceA - distanceB;
        });
        break;
      case "여행지 밀집도순":
        sorted.sort((a, b) => (b.density || 0) - (a.density || 0)); // ✅ density 없을 경우 0으로 처리
        break;
      default:
        break;
    }
    return sorted;
  }, [sortOption, travelList]);

  const currentItems = useMemo(() => paginate(sortedList, currentPage, itemsPerPage), [sortedList, currentPage]);

  return (
    <>
      <Row className="align-items-center mb-3">
        {/* 도 선택 */}
        <Col xs="auto">
          <Form.Select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </Form.Select>
        </Col>

        {/* 시/군/구 선택 */}
        <Col xs="auto">
          <Form.Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cityData[selectedProvince].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Form.Select>
        </Col>


        {/* 정렬 옵션 */}
        <Col xs="auto" className="ms-md-auto">
          <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="정렬">정렬</option>
            <option value="별점순">별점순</option>
            <option value="거리순">거리순</option>
            <option value="여행지 밀집도순">여행지 밀집도순</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? <p>로딩 중...</p> : travelList.length === 0 ? <p>결과 없음</p> : currentItems.map((item) => (
        <Link to={`/travel/${item.contentid}`} key={item.contentid} style={{ textDecoration: "none", color: "inherit" }}>
          <Row className="border p-3 mb-2">
            <Col xs={12} md={4}>
              <TourImage spotName={item.title} description={item.overview || "설명 정보가 없습니다."} />
            </Col>
            <Col className="d-flex flex-column justify-content-center">
              <h5>{item.title}</h5>
              <p>주소: {item.addr1}</p>
              <p>거리: {item.distance ? `${item.distance}km` : "계산 중..."}</p>
              <p>밀집도: {item.density !== undefined ? item.density : "계산 중..."} (반경: {item.radius}km)</p>
            </Col>
          </Row>
        </Link>
      ))}
      <PaginationComponent totalItems={travelList.length} onPageChange={setCurrentPage} />
    </>
  );
};

export default TourList;
