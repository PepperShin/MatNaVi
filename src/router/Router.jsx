import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../UI/layouts/MainLayout';
import TripInfoPage from '../UI/pages/TripInfoPage';
import { useParams } from "react-router-dom";

const TourInfoContent = () => {
  const { locationName } = useParams(); // URL에서 locationName 가져오기
  return <TripInfoPage keyword={locationName} />;
};

const routes = [
  {
    path: '/',
    element: <MainLayout />, // 기본 레이아웃
    children: [
      {
        path: '/tour/:locationName',// 지역명 검색 시 렌더링
        element: <TourInfoContent />, 
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