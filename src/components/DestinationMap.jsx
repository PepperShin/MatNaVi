import React, { useEffect, useRef } from "react";

export default function DestinationMap({ lat, lng, zoom = 14 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Naver Maps 스크립트 로드 함수
  const loadNaverMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        return resolve();
      }
      const script = document.createElement("script");
      script.id = "naver-maps-script";
      const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Naver Maps script failed to load"));
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 함수
  const initMap = () => {
    if (window.naver && window.naver.maps && mapRef.current) {
      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: zoom,
      });

      console.log("🗺️ 지도 초기화 완료");
    }
  };

  // lat, lng 변경 시 지도 중심 업데이트
  const updateMapCenter = () => {
    if (mapInstance.current) {
      const newCenter = new window.naver.maps.LatLng(lat, lng);
      console.log("🗺️ 지도 중심 업데이트:", newCenter);
      mapInstance.current.setCenter(newCenter);
      mapInstance.current.panTo(newCenter); // 🛠️ 지도 애니메이션 이동
    }
  };

  // 초기 로딩 시 지도 생성 및 중심 좌표 설정
  useEffect(() => {
    loadNaverMapScript()
      .then(() => {
        initMap();
        setTimeout(updateMapCenter, 500); // 지도 초기화 후 0.5초 뒤 업데이트
      })
      .catch((err) => console.error("❌ 지도 로드 실패:", err));
  }, []);

  // lat, lng 변경 시 지도 중심 업데이트
  useEffect(() => {
    setTimeout(updateMapCenter, 500); // 지도 중심 좌표 0.5초 후 업데이트
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
