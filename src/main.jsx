import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/Router'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 전역 스타일
import MainPage from "./UI/pages/MainPage.jsx"; // 루트로 쓸 컴포넌트

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>
)

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
