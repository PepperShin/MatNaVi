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
  */
  {
    path: '/',
    element: <Navigate to="/regional/경기도/수원시" replace />, // 기본 경로에서 자동 이동
  },

  {
    path: '/regional/:province/:city',
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