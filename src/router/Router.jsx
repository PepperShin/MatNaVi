import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../UI/layouts/MainLayout';
import TourInfo from '../UI/pages/TourInfo';

const routes = [
  {
    path: '/',
    element: <MainLayout />, // 기본 레이아웃
    children: [

  {
        path: 'TourInfo', // /TourInfo 경로 추가
        element: <TourInfo />,
      },

  {
      path: '/tour/:locationName',// 지역명 검색 시 렌더링
      element: <TourInfo />, 
      },
  {
        path: '*', // 404 페이지 처리
        element: <h2>페이지를 찾을 수 없습니다.</h2>,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export { router };