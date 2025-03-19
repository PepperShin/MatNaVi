// src/components/DestinationMap.jsx

import React, { useEffect, useRef } from "react";

export default function DestinationMap({ lat, lng, zoom = 14 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.naver.maps.LatLng(lat, lng);
      //console.log("🗺️ 지도 중심 업데이트:", newCenter);
      mapInstance.current.setCenter(newCenter); // 직접 지도 변경
    }else {
      console.warn("🚨 지도 인스턴스 없음. 다시 초기화 필요!");
    }
  }, [lat, lng]);
  
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
    }
  };

  // 초기 로딩 시 지도 생성
  useEffect(() => {
    loadNaverMapScript()
      .then(() => {
        initMap();
      })
      .catch((err) => console.error("❌ 지도 로드 실패:", err));
  }, []);

  // lat, lng 변경 시 지도 중심 업데이트
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.naver.maps.LatLng(lat, lng);
      //console.log("🗺️ 지도 중심 업데이트:", newCenter);
      mapInstance.current.setCenter(newCenter);
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};
