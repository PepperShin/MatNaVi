import React, { useEffect } from "react";

const NaverMap = () => {
  const maxMarkers = 5; // 마커 개수 제한
  let markerList = []; // 마커를 저장할 배열

  useEffect(() => {
    const { naver } = window;
    if (!naver) return;

    // 지도 생성 함수
    const createMap = (center) => {
      const map = new naver.maps.Map("map", {
        center: center,
        zoom: 14,
        minZoom: 12,
        maxZoom: 16,
      });

      // 마우스 클릭 시 마커 추가
      naver.maps.Event.addListener(map, "click", function (e) {
        const markerPosition = e.coord;

        // 만약 마커 개수가 최대값을 초과하면, 가장 오래된 마커 삭제
        if (markerList.length >= maxMarkers) {
          const removedMarker = markerList.shift(); // 가장 앞에 있는 마커를 제거
          removedMarker.setMap(null); // 지도에서 제거
        }

        // 새로운 마커 생성
        const marker = new naver.maps.Marker({
          position: markerPosition,
          map: map,
        });

        // 마커 클릭 시 정보창 열기
        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="padding:10px;">마커 클릭!</div>`,
        });

        naver.maps.Event.addListener(marker, "click", function () {
          infoWindow.open(map, marker);
        });

        // 새 마커를 리스트에 추가
        markerList.push(marker);
      });
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

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default NaverMap;
