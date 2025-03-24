import React, { useEffect, useRef, useState } from "react";
import {
  getEventInfo,
  getLodging,
  getNearbyTourLocation,
  getRestaurant,
  getTourLocationInfo,
} from "../../api/API";
import NaverSearchResult from "../components/NaverSearchResult";
import AroundTourData from "../components/AroundTourData";
import EventData from "../components/EventData";
import NaverMapPage from "./NaverMapPage"; // NaverMapPage 불러오기
import WeatherPage from "./WeatherPage"; // WeatherPage 불러오기
import { useParams } from "react-router-dom";

const TripInfoPage = () => {
  const [nav, setNav] = useState("lodging");
  const [tourData, setTourData] = useState();
  const [restaurant, setRestaurant] = useState();
  const [lodging, setLodging] = useState();
  const [aroundTourData, setAroundTourData] = useState();
  const [event, setEvent] = useState();

  const mounted = useRef(false);
  const contentid = useParams()



  useEffect(() => {
    // api 데이터 입력
    function getData() {
      getTourLocationInfo(`${contentid.contentid}`).then((result) => {
        setTourData(result);
      });
    }
    getData();
  }, [contentid]);

  useEffect(() => {
    // 주변 정보 입력
    if (!mounted.current) {
      mounted.current = true;
    } else {
      function getData() {
        // 숙소 검색
        getLodging(tourData[0].title).then((result) => {
          setLodging(result.items);
        });
        // 식당 검색
        getRestaurant(tourData[0].title).then((result) => {
          setRestaurant(result.items);
        });
        // 주변 여행지 검색
        getNearbyTourLocation(tourData[0].mapx, tourData[0].mapy).then((result) => {
          setAroundTourData(result);
        });
        // 행사 검색
        getEventInfo("20250322").then((result) => {
          const local = []
          result[0] && result.map((info) => {
            if (info.areacode == tourData[0].areacode)
              local.push(info)
          })
          setEvent(local);
        });
      }
      getData();
    }
  }, [tourData]);

  // 여행지 정보 출력
  function setInfo() {
    return (
      <>
        <h1>{tourData[0].title}</h1>
        <div>{tourData[0].overview}</div>
      </>
    );
  }

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
    lodging: <div>{Array.isArray(lodging) ? <NaverSearchResult datas={lodging}/> : "로딩중" }</div>,
    restaurant: <div>{Array.isArray(restaurant) ? <NaverSearchResult datas={restaurant}/> : "로딩중"}</div>,
    tourloc:<div>{Array.isArray(aroundTourData) ? <AroundTourData datas={aroundTourData}/> : "로딩중" }</div>,
    event: <div>{Array.isArray(event) ? <EventData datas={event}/> : "로딩중" }</div>,
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <div className="row bg-secondary p-0" style={{ width: "100%" }}>
          {/* 사진, 여행지 정보 */}
          <div className="col-lg-8 p-0">
            {tourData == null ? (
              <div>로딩중</div>
            ) : (
              <img
                src={tourData[0].firstimage}
                style={{ height: "100%", width: "100%" }}
              />
            )}
          </div>
          <div className="col-lg-4 bg-light">
            {tourData == null ? <div>로딩중</div> : setInfo()}
          </div>
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
          <div className="bg-light flex-grow-1" style={{overflow: "auto"}}>{buttonComponent[nav]}</div>
        </div>
        <div className="bg-light my-5" style={{ flexGrow: 1, width: "100%", height: "100%" }}>
          <WeatherPage />
        </div>
      </div>
    </div>
  );
};

export default TripInfoPage;
