import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function NextPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // /main → /next 이동 시, navigate("/next", { state: formData })로 받은 데이터
  const formData = location.state || {};

  const goBack = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>다음 페이지</h2>
      <p>도: {formData.province}</p>
      <p>시/군/구: {formData.city}</p>
      <p>예산: {formData.budget}</p>
      <p>일정: {formData.startDate} ~ {formData.endDate}</p>
      <p>거리: {formData.distance} km</p>

      <button onClick={goBack}>돌아가기</button>
    </div>
  );
}

export default NextPage;