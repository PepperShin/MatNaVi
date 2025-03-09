import React from "react";
import { routeConfig } from "../../../router/Router";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="container-expand d-flex align-items-center bg-dark" style={{ height: "80px" }}>
      <Link
        // 라우트 설정 배열의 첫 번째 요소의 path 사용 ("/")
        to={routeConfig[0].path}
        role="button"
        className="ms-5 fs-2 fw-bold text-light text-decoration-none"
      >
        MatNavi
      </Link>
    </div>
  );
};

export default Header;
