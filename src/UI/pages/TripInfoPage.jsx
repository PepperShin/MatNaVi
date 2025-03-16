import React, { useState } from "react";
import NaverMapPage from "./NaverMapPage"; // NaverMapPage 불러오기
import WeatherPage from "./WeatherPage"; // WeatherPage 불러오기

const TripInfoPage = () => {
  const [nav, setNav] = useState();

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

  const buttonComponent = {
    lodging: <div>숙소</div>,
    restaurant: <div>식당</div>,
    tourloc: <div>주변여행지</div>,
    event: <div>행사</div>,
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <div className="row bg-secondary p-0" style={{ height: "600px", width: "100%" }}>
          {/* 사진, 여행지 정보 */}
          <div className="col-lg-8  bg-primary">사진</div>
          <div className="col-lg-4 bg-warning">정보</div>
        </div>
        <div className="bg-secondary" style={{ height: "400px", width: "100%" }}>
          <NaverMapPage /> {/* 여기에 네이버 지도 추가 */}
        </div>
        <div className="d-flex flex-column bg-light my-5" style={{ height: "100%", width: "100%" }}>
          {/* 주변 정보 네비게이션 */}
          <ul className="nav nav-pills nav-fill" style={{ height: "100px" }}>
            {navComponent &&
              navComponent.map((component) => (
                <li
                  className="nav-item d-flex justify-content-center align-items-center"
                  id={component.id}
                  onClick={handleNav}
                >
                  <div className="text-align">{component.text}</div>
                </li>
              ))}
          </ul>
          <div className="bg-secondary flex-grow-1">{buttonComponent[nav]}</div>
        </div>
        <div className="bg-light my-5" style={{ flexGrow: 1, width: "100%", height: "100%" }}>
          <WeatherPage />
        </div>
      </div>
    </div>
  );
};

export default TripInfoPage;
