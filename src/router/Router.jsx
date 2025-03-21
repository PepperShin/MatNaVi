import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../UI/layouts/MainLayout';
import TripInfoPage from '../UI/pages/TripInfoPage';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { createAPIUrl } from '../common/commonUrl';
import { useEffect, useState } from 'react';

const TourInfoContent = () => {
  // URL에서 keyword 가져오기
  const { keyword, contentId } = useParams(); // param 어떻게 할지 정하기
  return <TripInfoPage keyword={keyword} contentId={contentId}/>;
};

const routes = [
  {
    path: '/',
    element: <MainLayout />, // 기본 레이아웃
    children: [
      {
        path: '/tour/:keyword',// 지역명 검색 시 렌더링
        // path: '/tour/:keyword/:contentId',// 지역명 + contentid
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