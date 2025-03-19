// src/router/Router.jsx

import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../UI/layouts/MainLayout";
import MainPage from "../UI/pages/MainPage";
import RegionalPage from "../UI/pages/RegionalPage";
import DistancePage from "../UI/pages/DistancePage";
import TravelDetailPage from "../UI/pages/TravelDetailPage";

export const routeConfig = [
  {
    path: "/",
    element: <MainLayout />,  // MainLayout을 공통으로 적용
    children: [
      { index: true, element: <MainPage /> },  // 기본 루트는 MainPage
      { path: "regional/:province/:city", element: <RegionalPage /> },  // RegionalPage도 MainLayout 내부에서 관리됨
      { path: "distance", element: <DistancePage /> },
      { path: "travel/:contentid", element: <TravelDetailPage /> },
    ],
  },
];

export const router = createBrowserRouter(routeConfig);
