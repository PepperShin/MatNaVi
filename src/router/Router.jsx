import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../UI/layouts/MainLayout";
import MainPage from "../UI/pages/MainPage";

// 라우트 설정 배열
export const routeConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
    
      { index: true, element: <MainPage /> },
     
    ],
  },
];

// 라우터 인스턴스 생성
export const router = createBrowserRouter(routeConfig);
