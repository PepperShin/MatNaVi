import { useState, useEffect } from "react";
import axios from "axios";
import { createAPIUrl } from "../../common/commonUrl";

const TourInfo = ({ selectedTab, keyword, areaCode, sigunguCode }) => {
  const [data, setData] = useState([]); //숙소 정보
  const [error, setError] = useState(null);

  useEffect(() => {
    if (areaCode) {
      fetchData();
    }
  }, [selectedTab, areaCode]);
  

  const fetchData = async () => {
    if (selectedTab === "lodging") {
      await getStayInfo();
    } else if (selectedTab === "restaurant") {
      setData([]); // TODO : 수정 필요
    } else if (selectedTab === "tourloc") {
      await getRecommendInfo();
    } else if (selectedTab === "event") {
      await getEventInfo();
    }  
  }

  const getStayInfo = async () => {
    try {
      const response = await axios.get(createAPIUrl("areaBasedList1", {
        arrange: "A",
        contentTypeId: 32,
        areaCode: areaCode,
        sigunguCode: sigunguCode,
      })); // 숙소 정보
      setData(response?.data?.response?.body?.items?.item || []);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setError("API 요청 실패");
    }
  };

  const getEventInfo = async () => {
    try {
      const response = await axios.get(createAPIUrl("areaBasedList1", {
        arrange: "A",
        contentTypeId: 15,
        areaCode: areaCode,
        sigunguCode: sigunguCode,
      })); //행사 정보
      setData(response?.data?.response?.body?.items?.item || []);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setError("API 요청 실패");
    }
  };

  const getRecommendInfo = async () => {
    try {
      const response = await axios.get(createAPIUrl("searchKeyword1", {
        arrange: "A",
        keyword: keyword,
        areaCode: areaCode,
        listYN: "Y",
      })); //다른 여행지 정보
      setData(response?.data?.response?.body?.items?.item || []);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setError("API 요청 실패");
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}

      {/* <h3>추천 여행지</h3> */}
      <ul>
        {data.map((arr, index) => (
          <li key={index}>
            <h4>{arr.title}</h4>
            {arr.firstimage && <img src={arr.firstimage} alt={arr.title} style={{ width: "100px", height: "100px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourInfo;