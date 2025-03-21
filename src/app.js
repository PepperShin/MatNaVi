import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router'; // 라우터 설정 import
import { AppProvider } from "../../../context/Context";  // AppProvider 가져오기
import TripInfoPage from "./pages/TripInfoPage";  // TripInfoPage 가져오기

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* RouterProvider를 사용하여 라우터 적용 */}
  </React.StrictMode>
);


export default App;