import React from "react";
import { useNavigate } from "react-router-dom";

function Part1() {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/main");
  };

  return (
    <div>
      <h1>여행지 추천</h1>
      <button onClick={goToMain}>메인으로 이동</button>
    </div>
  );
}

export default Part1;