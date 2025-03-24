// src/Router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import NaverMapPage from "../UI/pages/NaverMapPage";
import WeatherPage from "../UI/pages/WeatherPage";
import MainPage from "../UI/pages/MainPage";
import RegionalPage from "../UI/pages/RegionalPage";
import DistancePage from "../UI/pages/DistancePage";
import TripInfoPage from "../UI/pages/TripInfoPage";

const routes = [
  {
    path: "/",
    element: <MainPage />,
  },
    
  {
    // 팀원 코드에서는 RegionalPage에서 useParams()로 province와 city를 읽습니다.
    path: "/regional/:province/:city",
    element: <RegionalPage />,
  },

  {
    path: "/distance",
    element: <DistancePage />,
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },

  {
    path: "/tripinfo",
    element: <TripInfoPage/>,
    title: "여행지 정보",
  },

  {
    path: "/naver-map-page",
    element: <NaverMapPage />,
    title: "네이버 맵",
  },

  {
    path: "/weather-page",
    element: <WeatherPage />,
    title: "날씨",
  },
];

const router = createBrowserRouter(routes);
export { router, routes };
