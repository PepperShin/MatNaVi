// src/api/Location.js
import { getCoordinatesByAddress } from './API';
import { cityData } from "../data/locationData";  // data/locationData.js에서 가져오기

export function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        callback(userLocation);
      },
      (error) => {
        console.error("❌ 위치 정보를 가져오는데 실패했습니다.", error);
        callback(null);
      }
    );
  } else {
    console.error("❌ 브라우저가 위치 정보를 지원하지 않습니다.");
    callback(null);
  }
}

export async function getAddressFromCoordinates(lat, lng) {
  try {
    const url = `/naver-api/map-reversegeocode/v2/gc?coords=${lng},${lat}&sourcecrs=EPSG:4326&orders=addr&output=json`;
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse Geocoding 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return (
        data.results[0].region.area1.name +
        " " +
        data.results[0].region.area2.name +
        " " +
        data.results[0].region.area3.name
      );
    } else {
      return "주소를 찾을 수 없음";
    }
  } catch (error) {
    console.error("❌ Reverse Geocoding API 요청 실패:", error);
    return null;
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

export async function getNearbyCities(userLocation, distanceFilter) {
  const cities = [];
  for (const province in cityData) {
    for (const city of cityData[province]) {
      const coords = await getCoordinatesByAddress(province, city);
      if (coords) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, coords.lat, coords.lng);
        if (dist <= distanceFilter) {
          cities.push({ name: city, lat: coords.lat, lng: coords.lng, distance: dist, province });
        }
      }
    }
  return cities.sort((a, b) => a.distance - b.distance);
}
}
