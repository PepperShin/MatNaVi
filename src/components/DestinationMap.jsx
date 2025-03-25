// src/components/DestinationMap.jsx
import React, { useEffect, useRef } from "react";

export default function DestinationMap({ lat, lng, zoom = 14 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);


  useEffect(() => {
    const loadNaverMapScript = () => {
      return new Promise((resolve, reject) => {
        const existingScript = document.getElementById("naver-maps-script");
        if (existingScript) {
          existingScript.remove();
        }
        const script = document.createElement("script");
        script.id = "naver-maps-script";
        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID.trim();
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Naver Maps script failed to load"));
        document.head.appendChild(script);
      });
    };

    loadNaverMapScript()
      .then(() => {
        if (window.naver && window.naver.maps && mapRef.current) {
          mapInstance.current = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: zoom,
          });
        } else {
          console.error("네이버 지도 API가 로드되지 않았습니다.");
        }
      })
      .catch((err) => console.error("❌ 지도 로드 실패:", err));
  }, [lat, lng, zoom]);

  // lat, lng가 변경되면 지도 중심을 업데이트합니다.
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.naver.maps.LatLng(lat, lng);
      mapInstance.current.setCenter(newCenter);
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
