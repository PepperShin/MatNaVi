// src/utils/Density.js

import { getCoordinatesByAddress } from "../api/NaverApi";
import { calculateDistance } from "../api/Location.js";
import { getCachedCoordinate, setCachedCoordinate } from "./CoordinateCache";

// 동적으로 반경을 확장해서 밀집도 계산
export async function calculateDynamicDensity(touristData, minCount = 1, initialRadius = 3, maxRadius = 3) {
  return Promise.all(
    touristData.map(async (currentPlace) => {
      let lat1 = Number(currentPlace.mapy);
      let lon1 = Number(currentPlace.mapx);

      // 좌표가 없으면 주소로 변환 (캐싱 적용)
      if (isNaN(lat1) || isNaN(lon1)) {
        const cached = getCachedCoordinate(currentPlace.addr1);
        if (cached) {
          ({ lat: lat1, lng: lon1 } = cached);
        } else {
          const coord = await getCoordinatesByAddress(currentPlace.addr1);
          if (coord) {
            lat1 = Number(coord.lat);
            lon1 = Number(coord.lng);
            setCachedCoordinate(currentPlace.addr1, coord);
          } else {
            console.error("❌ 좌표 변환 실패:", currentPlace.addr1);
            return { ...currentPlace, density: 0, radius: initialRadius };
          }
        }
      }

      let radius = initialRadius;
      let count = 0;

      if (minCount === 0) {
        count = touristData.filter((place) => {
          const lat2 = Number(place.mapy);
          const lon2 = Number(place.mapx);
          const distance = calculateDistance(lat1, lon1, lat2, lon2);
          return distance <= radius;
        }).length;
      } else {
        while (count < minCount && radius <= maxRadius) {
          count = 0;
          for (const place of touristData) {
            let lat2 = Number(place.mapy);
            let lon2 = Number(place.mapx);

            if (isNaN(lat2) || isNaN(lon2)) {
              const cached2 = getCachedCoordinate(place.addr1);
              if (cached2) {
                ({ lat: lat2, lng: lon2 } = cached2);
              } else {
                const coord = await getCoordinatesByAddress(place.addr1);
                if (coord) {
                  lat2 = Number(coord.lat);
                  lon2 = Number(coord.lng);
                  setCachedCoordinate(place.addr1, coord);
                } else {
                  continue;
                }
              }
            }

            const distance = calculateDistance(lat1, lon1, lat2, lon2);
            if (distance <= radius) {
              count++;
            }
          }
          radius += 1;
        }
      }

      return { ...currentPlace, density: Number(count), radius: radius - 1 };
    })
  );
}
