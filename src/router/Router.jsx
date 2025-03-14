import { createBrowserRouter } from "react-router-dom";
import TempPage from "../UI/pages/TempPage";
import MainLayout from "../UI/layouts/MainLayout";
import NaverMapPage from "../UI/pages/NaverMapPage";
import WeatherPage from "../UI/pages/WeatherPage";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
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
