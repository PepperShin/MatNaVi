// src/utils/CoordinateCache.js
// 공통 좌표 캐시 유틸리티
const coordinateCache = {};

export function getCachedCoordinate(address) {
  return coordinateCache[address];
}

export function setCachedCoordinate(address, coord) {
  coordinateCache[address] = coord;
}
