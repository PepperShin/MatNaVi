import React, { useState } from "react";
import TourDetail from "../components/TourDetail";
import TourInfo from "../components/TourInfo";

const TripInfoPage = ({keyword}) => {
  const [nav, setNav] = useState("tourloc"); // 기본값: 주변 여행지
  const [areaCode, setAreaCode] = useState(0);
  const [sigunguCode, setSigunguCode] = useState(0);

  const handleNav = (event) => {
    const name = event.currentTarget.id;
    setNav(name);
  };

  const navComponent = [
    { id: "lodging", text: "숙소" },
    { id: "restaurant", text: "식당" }, // 식당 정보 추가 가능
    { id: "tourloc", text: "다른 여행지" },
    { id: "event", text: "행사 정보" },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        {/* 사진 및 여행지 정보 */}
        <div className="row bg-secondary p-0" style={{ height: "600px", width: "100%" }}>
          <TourDetail contentId={126508} setAreaCode={setAreaCode} setSigunguCode={setSigunguCode}/>
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
            <TourInfo selectedTab={nav} keyword={keyword} areaCode={areaCode} sigunguCode={sigunguCode}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripInfoPage;