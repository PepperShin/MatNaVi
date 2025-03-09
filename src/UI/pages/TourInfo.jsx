import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";

const TourInfo = () => {
  // const { areaCode } = useParams(); // URL에서 지역 코드 가져오기
  const [areaCode, setAreaCode] = useState(1);
  const navigate = useNavigate();
  const [tourData, setTourData] = useState([]); // 지역 정보
  const [recommendedDestinations, setRecommendedDestinations] = useState([]); // 추천 여행지
  const [accommodation, setAccommodation] = useState([]); // 숙소 정보
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [detail, setDetail] = useState([]); // 상세 정보 상태
  const [coordinates, setCoordinates] = useState({})
  
  const [error, setError] = useState(null); // 에러 상태

  const apiKey = import.meta.env.VITE_TOUR_API_KEY; // 환경변수에서 API 키 가져오기
  // API URL 목록
  const urls = {
    //시군구 코드 필수 (sigunguCode)
    // areaInfo: `https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`,
    festival: `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`,
    searchkeyword: `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`,
    stay: `https://apis.data.go.kr/B551011/KorService1/searchStay1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`,
    areaBased: `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${apiKey}&pageNo=1&numOfRows=10&MobileApp=AppTest&MobileOS=ETC&arrange=A&contentTypeId=32&areaCode=1&sigunguCode=1&_type=json`
    //detail: `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&sigungyCode=${areaCode}`
  };
  useEffect(() => {
    // if (!areaCode) return;

    const fetchTourData = async () => {
      try {
        // 여러 API 요청을 동시에 실행
        const responses = await axios.all([
          axios.get(urls.areaInfo),
          axios.get(urls.festival),
          axios.get(urls.stay),
          axios.get(urls.searchkeyword),
          // axios.get(urls.detail),
          axios.get(urls.areaBased)
        ]);

        // API 응답 데이터 추출
        const areaData = responses[0]?.data?.response?.body?.items?.item || [];
        const festivalData = responses[1]?.data?.response?.body?.items?.item || [];
        const stayData = responses[2]?.data?.response?.body?.items?.item || [];
        const searchKeywordData = responses[3]?.data?.response?.body?.items?.item || [];
        const detailData = responses[4]?.data?.response?.body?.items?.item || [];
        

        // 상태 업데이트
        setTourData(areaData);
        setRecommendedDestinations(festivalData);
        setAccommodation(stayData);
        setDetail(detailData);
        setCoordinates({
          nx: detailData[0].mapy,
          ny: detailData[0].mapx
        })
        console.log(coordinates)

      } catch (error) {
        console.error("API 요청 실패:", error);
        setError("API 요청 실패");
      }
    };

    fetchTourData();
  }, []);

  return (
    <div>
      {/* 에러 처리 */}
      {error && <p>{error}</p>}

      {/* 지역 정보 출력 */}
      {tourData.length > 0 ? (
        <div>
          <h2>{tourData[0]?.title || "지역 정보"}</h2>
          {tourData[0]?.firstimage && (
            <img src={tourData[0].firstimage} alt={tourData[0].title} style={{ width: "100%" }} />
          )}
          <p>{tourData[0]?.overview}</p>
        </div>
      ) : (
        <p>지역 정보를 불러오는 중...</p>
      )}

      {/* 여행지 상세 정보 */}
      {detail.length > 0 && (
        <div>
          <h3>여행지 상세 정보</h3>
          <p>{detail[0]?.overview || "상세 정보 없음"}</p>
          <p>{detail[0]?.mapx} {detail[0]?.mapy} || "상세 정보 없음"</p>
        </div>
      )}

      {/* 추천 여행지 */}
      {recommendedDestinations.length > 0 && (
        <div>
          <h3>추천 여행지</h3>
          <ul>
            {recommendedDestinations.map((destination, index) => (
              <li key={index}>
                <h4>{destination.title}</h4>
                {destination.firstimage && (
                  <img src={destination.firstimage} alt={destination.title} style={{ width: "100px", height: "100px" }} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 숙소 정보 */}
      {accommodation.length > 0 && (
        <div>
          <h3>숙소 정보</h3>
          <ul>
            {accommodation.map((place, index) => (
              <li key={index}>
                <h4>{place.title}</h4>
                <p>{place.addr1}</p>
                {place.firstimage && (
                  <img src={place.firstimage} alt={place.title} style={{ width: "100px", height: "100px" }} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {coordinates && <WeatherInfo coordinates={coordinates} />}
    </div>
  );
};

export default TourInfo;