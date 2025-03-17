import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../UI/layouts/MainLayout";
import MainPage from "../UI/pages/MainPage";
import NextPage from "../UI/pages/Nextpage";



// 라우트 설정 배열
export const routeConfig = [
  {
    path: "/",
    element: <MainPage />,
  },
  { 
    path: "next", 
    element: <NextPage /> 
  },
];

// 라우터 인스턴스 생성
export const router = createBrowserRouter(routeConfig);
