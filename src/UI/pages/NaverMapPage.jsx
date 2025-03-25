import React, { useEffect, useRef } from 'react';

const NaverMapPage = ({ tourLocations }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const { naver } = window;
    if (!naver) return;

    // 지도 초기화
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.5665, 126.978), // 기본 위치 (서울)
      zoom: 13,
    });

    if (tourLocations && Array.isArray(tourLocations)) {
      tourLocations.forEach((location) => {
        const { mapx, mapy, title } = location; // 여행지의 좌표 및 정보
        // 마커 생성
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(mapy, mapx),
          map: map,
        });

        // 마커 클릭 시 표시
        const infowindow = new naver.maps.InfoWindow({
          content: `<div><strong>${title}</strong></div>`,
        });

        // 마커 클릭 이벤트 추가
        naver.maps.Event.addListener(marker, 'click', function () {
          // 마커 클릭 시 정보창 표시
          infowindow.open(map, marker);
        });

        // 마커 추가 후 지도 중심 이동
        map.setCenter(new naver.maps.LatLng(mapy, mapx));
      });
    }
  }, [tourLocations]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default NaverMapPage;
