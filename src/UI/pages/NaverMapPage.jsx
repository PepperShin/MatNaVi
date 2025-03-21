import React, { useEffect, useRef, useState } from 'react';
import { getCurrentLocation } from '../../api/Location';

const NaverMap = () => {
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치 상태 추가
  const maxMarkers = 1; // 마커 개수 제한
  const markerList = useRef([]); // useRef로 마커 리스트 관리

  // 지도 생성 함수
  const createMap = (center) => {
    const { naver } = window;
    if (!naver) return;

    const map = new naver.maps.Map('map', {
      center: center,
      zoom: 18,
      minZoom: 16,
      maxZoom: 20,
    });

    // 마커 생성 함수
    const createMarker = (map, position) => {
      const marker = new naver.maps.Marker({
        position,
        map,
      });
      return marker;
    };

    // 사용자 위치에 초기 마커 추가
    const initialMarker = createMarker(map, center);
    markerList.current.push(initialMarker);

    // 마우스 클릭 시 마커 추가
    naver.maps.Event.addListener(map, 'click', function (e) {
      const markerPosition = e.coord;

      // 마커 개수가 최대값이면, 가장 오래된 마커 제거
      if (markerList.current.length >= maxMarkers) {
        const removedMarker = markerList.current.shift();
        removedMarker.setMap(null);
      }

      const marker = createMarker(map, markerPosition);
      markerList.current.push(marker);
    });

    return map;
  };

  useEffect(() => {
    getCurrentLocation((loc) => {
      if (loc) {
        setUserLocation(loc); // 사용자 위치 업데이트
      } else {
        console.error('❌ 사용자 위치를 가져오지 못했습니다.');

        // 기본 위치 설정 (서울)
        const defaultLocation = new naver.maps.LatLng(37.5665, 126.978);
        createMap(defaultLocation); // 기본 위치로 지도 생성
      }
    });
  }, []);

  useEffect(() => {
    if (userLocation) {
      const { lat, lng } = userLocation;
      const userLatLng = new naver.maps.LatLng(lat, lng);
      createMap(userLatLng); // 사용자 위치로 지도 생성
    }
  }, [userLocation]); // 사용자 위치가 변경될 때마다 지도 업데이트

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default NaverMap;
