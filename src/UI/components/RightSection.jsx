import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RightSection() {
  const navigate = useNavigate();
  const distanceOptions = [10, 30, 50, 100, 200];
  const [distanceIndex, setDistanceIndex] = useState(0);
  const [rightBudget, setRightBudget] = useState("");
  const [rightStartDate, setRightStartDate] = useState("");
  const [rightEndDate, setRightEndDate] = useState("");

  const handleDistanceChange = (e) => setDistanceIndex(e.target.value);
  const handleRightBudgetChange = (e) => setRightBudget(e.target.value);
  const handleRightStartDateChange = (e) => setRightStartDate(e.target.value);
  const handleRightEndDateChange = (e) => setRightEndDate(e.target.value);

  const handleRightSubmit = () => {
    const rightData = {
      distance: distanceOptions[distanceIndex],
      budget: rightBudget,
      startDate: rightStartDate,
      endDate: rightEndDate,
    };
    navigate("/next-right", { state: rightData });
  };

  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #ccc",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "10px",
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: "50px" }}>거리</h3>
        <div style={{ marginBottom: "100px" }}>
          <input
            type="range"
            min="0"
            max={distanceOptions.length - 1}
            step="1"
            value={distanceIndex}
            onChange={handleDistanceChange}
          />
          <span style={{ marginLeft: "20px" }}>
            {distanceOptions[distanceIndex]} km
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "100px",
          }}
        >
          <div style={{ flex: "0 0 100px", textAlign: "center" }}>
            <h3>예산</h3>
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="number"
              placeholder="금액을 입력"
              style={{ width: "400px" }}
              value={rightBudget}
              onChange={handleRightBudgetChange}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "140px",
            marginBottom: "10px",
          }}
        >
          <div style={{ width: "80px", textAlign: "right" }}>
            <h3>일정</h3>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "5px" }}>
              <label style={{ marginRight: "5px" }}>시작일:</label>
              <input
                type="date"
                value={rightStartDate}
                onChange={handleRightStartDateChange}
              />
            </div>
            <div>
              <label style={{ marginRight: "5px" }}>종료일:</label>
              <input
                type="date"
                value={rightEndDate}
                onChange={handleRightEndDateChange}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleRightSubmit}
        style={{
          width: "120px",
          margin: "0 auto",
        }}
      >
        선택
      </button>
    </div>
  );
}

export default RightSection;
