// src/router/Router.jsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
//import HomePage from '../UI/pages/HomePage';
import RegionalPage from '../UI/pages/RegionalPage';
import DistancePage from '../UI/pages/DistancePage';
import TravelDetailPage from '../UI/pages/TravelDetailPage'; // 상세 페이지 import

const routes = [
  /*
  {
        path: '/',
        element: <Navigate to="/regional" replace />
  },
 
  {
    path: '/',
    element: <Navigate to="/regional/수원" replace /> // 기본값을 수원으로 지정
  },
  */ 

  {
    path: '/',
    element: <RegionalPage />
  },

  {
    path: '/regional/:areaName',
    element: <RegionalPage />
  },
  {
    path: '/distance',
    element: <DistancePage />
  },
  {
    path: '/travel/:contentid',  // 상세 페이지 라우트 추가
    element: <TravelDetailPage />
  },
];

const router = createBrowserRouter(routes);

export { router, routes };