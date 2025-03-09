import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../UI/layouts/MainLayout";
import Part1 from "../UI/pages/Part1";
import MainPage from "../UI/pages/MainPage";
import NextPage from "../UI/pages/NextPage";

// 라우트 설정 배열
export const routeConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Part1 /> },
      { path: "main", element: <MainPage /> },
      { path: "next", element: <NextPage /> },
    ],
  },
];

// 라우터 인스턴스 생성
export const router = createBrowserRouter(routeConfig);
