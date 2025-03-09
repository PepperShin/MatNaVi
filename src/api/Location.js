// src/api/Location.js

import { getCoordinates } from "./API";

// 주소 정리 함수 (불필요한 정보 제거)
export function cleanAddress(address) {
    return address.replace(/\([^)]*\)|\[[^\]]*\]/g, "").trim();
}

// 사용자 위치를 가져오는 함수
export function getCurrentLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("📍 내 위치 (GPS):", userLocation);
          callback(userLocation);
        },
        (error) => {
          console.error("❌ 위치 정보를 가져오는데 실패했습니다.", error);
          callback(null); // 실패 시 null 반환
        }
      );
    } else {
      console.error("❌ 브라우저가 위치 정보를 지원하지 않습니다.");
      callback(null);
    }
  }

  // 사용자의 좌표를 주소로 변환
  export async function getAddressFromCoordinates(lat, lng) {
    try {
        const url = `/naver-api/map-reversegeocode/v2/gc?coords=${lng},${lat}&sourcecrs=EPSG:4326&orders=addr&output=json`;
        const response = await fetch(url, {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': import.meta.env.VITE_NAVER_CLIENT_ID,
                'X-NCP-APIGW-API-KEY': import.meta.env.VITE_NAVER_CLIENT_SECRET,
            },
        });

        if (!response.ok) {
            throw new Error(`Reverse Geocoding 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log("📍 내 위치 주소 변환 결과:", data);

        if (data.results && data.results.length > 0) {
            return data.results[0].region.area1.name + " " +
                   data.results[0].region.area2.name + " " +
                   data.results[0].region.area3.name;
        } else {
            return "주소를 찾을 수 없음";
        }
    } catch (error) {
        console.error("❌ Reverse Geocoding API 요청 실패:", error);
        return null;
    }
}

// 📍 주소 → 좌표 변환 API 호출 (실패 시 최대 2회 재시도)
export async function retryGetCoordinates(query, maxRetries = 2) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await getCoordinates(query);
        if (result) return result;

        console.warn(`⚠️ [${attempt}/${maxRetries}] 주소 변환 실패: ${query}`);
    }

    console.error(`❌ [최종 실패] 주소 변환 안됨: ${query}`);
    return null; // 두 번 시도 후 실패하면 null 반환
}

// 사용자 위치와 관광지 위치를 비교해서 거리(km)를 계산하는 함수
export function calculateDistance(lat1, lon1, lat2, lon2) {

    // 좌표가 숫자인지 확인
    if (![lat1, lon1, lat2, lon2].every(coord => typeof coord === 'number' && !isNaN(coord))) {
        console.error("❌ 거리 계산 오류: 유효하지 않은 좌표 값", { lat1, lon1, lat2, lon2 });
        return NaN; // NaN 대신 적절한 기본값을 반환할 수도 있음
    }

    const R = 6371; // 지구 반지름 (단위: km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Number((R * c).toFixed(2)); // 숫자로 변환하여 반환
}