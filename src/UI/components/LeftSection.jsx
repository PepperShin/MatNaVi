import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { provinces, cityData } from "../../data/locationData";

function LeftSection() {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [leftBudget, setLeftBudget] = useState("");
  const [leftStartDate, setLeftStartDate] = useState("");
  const [leftEndDate, setLeftEndDate] = useState("");

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => setSelectedCity(e.target.value);
  const handleLeftBudgetChange = (e) => setLeftBudget(e.target.value);
  const handleLeftStartDateChange = (e) => setLeftStartDate(e.target.value);
  const handleLeftEndDateChange = (e) => setLeftEndDate(e.target.value);

  const handleLeftSubmit = () => {
    const leftData = {
      province: selectedProvince,
      city: selectedCity,
      budget: leftBudget,
      startDate: leftStartDate,
      endDate: leftEndDate,
    };
    navigate("/next-left", { state: leftData });
  };

  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #ccc",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        color: "#333",
        padding: "10px",
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: "80px" }}>도 & 시/군/구 선택</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginBottom: "80px",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <select value={selectedProvince} onChange={handleProvinceChange}>
              <option value="">-- 도 선택 --</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: "left" }}>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedProvince}
            >
              <option value="">-- 시/군/구 선택 --</option>
              {selectedProvince &&
                cityData[selectedProvince]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "90px",
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
              value={leftBudget}
              onChange={handleLeftBudgetChange}
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
                value={leftStartDate}
                onChange={handleLeftStartDateChange}
              />
            </div>
            <div>
              <label style={{ marginRight: "5px" }}>종료일:</label>
              <input
                type="date"
                value={leftEndDate}
                onChange={handleLeftEndDateChange}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleLeftSubmit}
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

export default LeftSection;
