// src/Router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../UI/layouts/MainLayout";
import NaverMapPage from "../UI/pages/NaverMapPage";
import WeatherPage from "../UI/pages/WeatherPage";
import MainPage from "../UI/pages/MainPage";
import RegionalPage from "../UI/pages/RegionalPage";
import DistancePage from "../UI/pages/DistancePage";

const routes = [
  {
    path: "/",
    element: <MainPage />,
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
];

const router = createBrowserRouter(routes);
export { router, routes };
