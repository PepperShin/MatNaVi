import React from "react";
//import { router } from "../../../router/Router";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="container-expand d-flex align-items-center bg-dark" style={{height: "80px"}}>
      <Link
        // 라우터의 제일 기본 패스로 이동
        to="/"
        role="button"
        className="ms-5 fs-2 fw-bold text-light text-decoration-none"
      >
        MatNavi
      </Link>
    </div>
  );
};

export default Header;
