import React from "react";
import LeftSection from "../components/LeftSection";
import RightSection from "../components/RightSection";

function MainPage() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* 배경 레이어 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "800px",
          backgroundImage: `url("/images/background.jpg")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "50px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            gap: "300px",
            height: "600px",
            marginLeft: "200px",
            marginRight: "200px",
          }}
        >
          <LeftSection />
          <RightSection />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
