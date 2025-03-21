import React, { useState, useEffect } from "react";
import axios from "axios";
import TourDetail from "../components/TourDetail";
import TourInfo from "../components/TourInfo";
import { xml2json } from "xml-js";
import { getTourLocationInfo } from "../../api/API";
import { func } from "prop-types";


const TripInfoPage = ({ keyword, contentId }) => {
  const [nav, setNav] = useState("tourloc"); // 기본값: 주변 여행지
  const [areaCode, setAreaCode] = useState(0);
  const [sigunguCode, setSigunguCode] = useState(0);
  const [tourData, setTourData] = useState();
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태 관리

  const api = getTourLocationInfo("126508")
  console.log(api)
  useEffect (() => {
    function getData(){
      getTourLocationInfo("126508").then( (result) => {
        setTourData(result)
        console.log(tourData)
      })
    } 
    getData()
  },[])

  const handleNav = (event) => {
    const name = event.currentTarget.id;
    setNav(name);
  };

  const navComponent = [
    { id: "lodging", text: "숙소" },
    { id: "restaurant", text: "식당" },
    { id: "tourloc", text: "다른 여행지" },
    { id: "event", text: "행사 정보" },
  ];

  useEffect(() => {
    // API 요청을 통해 여행지 정보를 불러오기
    if (contentId) {
      axios
        .get(createAPIUrl("detailCommon1", {
          contentId: contentId,
          firstImageYN: "Y",
          areacodeYN: "Y",
          addrinfoYN: "Y",
          mapinfoYN: "Y",
          overviewYN: "Y",
          defaultYN: "Y",
        }))
        .then((response) => {
          const data = response?.data?.response?.body?.items?.item[0];
          if (data) {
            setAreaCode(data.areacode);
            setSigunguCode(data.sigungucode);
            setTourData([data]); // TourDetail에 전달할 데이터 설정
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
          setLoading(false);
        });
    }
  }, [contentId]);

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">

        <div
          className="row bg-secondary p-0"
          style={{ height: "600px", width: "100%" }}
        >
        {/* 사진 및 여행지 정보 */}
        <div className="col-lg-8  bg-primary">
          <img src={``} alt="" />
        </div>
          <div className="col-lg-4 bg-warning">정보</div>
        </div>

        <div className="row bg-secondary p-0" style={{ height: "600px", width: "100%" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TourDetail contentId={contentId} setAreaCode={setAreaCode} setSigunguCode={setSigunguCode} />
          )}
        </div>

        {/* 지도 표시 */}
        <div className="bg-secondary" style={{ height: "400px", width: "100%" }}>
          🗺️ 지도
        </div>

        {/* 주변 정보 네비게이션 */}
        <div className="d-flex flex-column bg-light my-5" style={{ height: "600px", width: "100%" }}>
          <ul className="nav nav-pills nav-fill" style={{ height: "100px" }}>
            {navComponent.map((component) => (
              <li
                className="nav-item d-flex justify-content-center align-items-center"
                key={component.id}
                id={component.id}
                onClick={handleNav}
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  backgroundColor: nav === component.id ? "#007bff" : "#ddd",
                  color: nav === component.id ? "white" : "black",
                  borderRadius: "5px",
                  margin: "5px",
                }}
              >
                {component.text}
              </li>
            ))}
          </ul>

          {/* 선택된 탭에 따라 TourInfo 컴포넌트 렌더링 */}
          <div className="bg-secondary flex-grow-1">
            <TourInfo selectedTab={nav} keyword={keyword} areaCode={areaCode} sigunguCode={sigunguCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripInfoPage;