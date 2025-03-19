// src/UI/layouts/MainLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";


function MainLayout() {
  return (
    <div>
      {/* 공통 헤더 */}
      <Header />
      
      {/* 자식 라우트가 표시되는 영역 */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;