import React, { useEffect, useRef } from "react";

const NaverMap = () => {
  const maxMarkers = 1; // 마커 개수 제한
  const markerList = useRef([]); // useRef로 마커 리스트 관리

  useEffect(() => {
    const { naver } = window;
    if (!naver) return;

    // 마커 생성 함수
    const createMarker = (map, position) => {
      const marker = new naver.maps.Marker({
        position,
        map,
      });
      return marker;
    };

    // 지도 생성 함수
    const createMap = (center) => {
      const map = new naver.maps.Map("map", {
        center: center,
        zoom: 18,
        minZoom: 16,
        maxZoom: 20,
      });

      // 사용자 위치에 초기 마커 추가
      const initialMarker = createMarker(map, center);
      markerList.current.push(initialMarker);

      // 마우스 클릭 시 마커 추가
      naver.maps.Event.addListener(map, "click", function (e) {
        const markerPosition = e.coord;

        // 마커 개수가 최대값이면, 가장 오래된 마커 제거
        if (markerList.current.length >= maxMarkers) {
          const removedMarker = markerList.current.shift();
          removedMarker.setMap(null);
        }

        const marker = createMarker(map, markerPosition);
        markerList.current.push(marker);
      });

      // 클린업 예시 (필요 시 이벤트 리스너 제거)
      return map;
    };

    // 사용자 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        createMap(userLocation); // 사용자 위치로 지도 생성
      },
      () => {
        // 위치 정보를 못 가져오면 기본 위치(서울) 설정
        const defaultLocation = new naver.maps.LatLng(37.5665, 126.978);
        createMap(defaultLocation); // 기본 위치로 지도 생성
      }
    );
  }, []);

  return <div id="map" style={{ width: "100%", height: "100%" }}></div>;
};

export default NaverMap;
