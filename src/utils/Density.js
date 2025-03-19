// src/utils/Density.js

import { getCoordinatesByAddress } from "../api/API";
import { calculateDistance } from "../api/Location";

const coordinateCache = {}; // 좌표 캐싱 객체


// 동적으로 반경을 확장해서 밀집도 계산
export async function calculateDynamicDensity(touristData, minCount = 1, initialRadius = 3, maxRadius = 3) {
    return Promise.all(
        touristData.map(async (currentPlace) => {
            let lat1 = Number(currentPlace.mapy);
            let lon1 = Number(currentPlace.mapx);

            // 좌표가 없으면 주소로 변환 (캐싱 적용)
            if (isNaN(lat1) || isNaN(lon1)) {
                if (coordinateCache[currentPlace.addr1]) {
                    ({ lat: lat1, lng: lon1 } = coordinateCache[currentPlace.addr1]);
                } else {
                    const coord = await getCoordinatesByAddress(currentPlace.addr1);
                    if (coord) {
                        lat1 = Number(coord.lat);
                        lon1 = Number(coord.lng);
                        coordinateCache[currentPlace.addr1] = coord;
                    } else {
                        console.error("❌ 좌표 변환 실패:", currentPlace.addr1);
                        return { ...currentPlace, density: 0, radius: initialRadius };
                    }
                }
            }

            let radius = initialRadius;
            let count = 0;
            //console.log(`🚀 루프 진입1: ${currentPlace.addr1}, 반경=${radius}, 카운트=${count}`);

            if (minCount === 0) {
                // minCount가 0이면, 한 번만 계산하도록 처리
                count = touristData.filter((place) => {
                    const lat2 = Number(place.mapy);
                    const lon2 = Number(place.mapx);
                    const distance = calculateDistance(lat1, lon1, lat2, lon2);
                    return distance <= radius;
                }).length;
            } else {
                while (count < minCount && radius <= maxRadius) {
                    //console.log(`🚀 루프 진입2: 반경=${radius}, 카운트=${count}`);
                    count = 0;
                    for (const place of touristData) {
                        let lat2 = Number(place.mapy);
                        let lon2 = Number(place.mapx);

                        if (isNaN(lat2) || isNaN(lon2)) {
                            if (coordinateCache[place.addr1]) {
                                ({ lat: lat2, lng: lon2 } = coordinateCache[place.addr1]);
                            } else {
                                const coord = await getCoordinatesByAddress(place.addr1);
                                if (coord) {
                                    lat2 = Number(coord.lat);
                                    lon2 = Number(coord.lng);
                                    coordinateCache[place.addr1] = coord;
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

            //console.log("좌표 확인:", currentPlace.addr1, currentPlace.mapy, currentPlace.mapx);
            return { ...currentPlace, density: Number(count), radius: radius-1 };
        })
    );
}