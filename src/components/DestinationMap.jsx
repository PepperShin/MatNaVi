// src/components/DestinationMap.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function DestinationMap({ lat, lng, zoom = 14 }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Naver Maps 스크립트를 동적으로 로드하는 함수
  const loadNaverMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        // 이미 스크립트가 로드된 경우 바로 resolve
        return resolve();
      }
      const script = document.createElement('script');
      script.id = 'naver-maps-script';
      // 환경 변수에서 클라이언트 아이디(키)를 가져옵니다.
      const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
      // Naver Maps JS API URL (필요한 서브모듈이 있다면 submodules 파라미터 추가 가능)
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Naver Maps script failed to load'));
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 함수
  const initMap = () => {
    if (window.naver && window.naver.maps && mapRef.current) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: zoom,
      };
      const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);
    }
  };

  // 컴포넌트 마운트 시 Naver Maps 스크립트 로드 후 지도 초기화
  useEffect(() => {
    loadNaverMapScript()
      .then(() => {
        initMap();
      })
      .catch((err) => console.error(err));
  }, []);

  // lat, lng, zoom 값 변경 시 지도 업데이트
  useEffect(() => {
    if (map) {
      const newCenter = new window.naver.maps.LatLng(lat, lng);
      map.setCenter(newCenter);
      map.setZoom(zoom);
    }
  }, [lat, lng, zoom, map]);

  // 지도 컨테이너의 크기는 부모 스타일에 맞게 지정 (예: height, width)
  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}