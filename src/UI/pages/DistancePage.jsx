//src/UI/pages/DistancePage.jsx

import { useState, useEffect } from 'react';
import DestinationMap from '../components/DestinationMap';
import TouristSpotCard from '../components/TouristSpotCard';
import Pagination from '../components/Pagination';

export default function DistancePage() {
  const [spots, setSpots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // API 호출 로직 (임시로 생략, 실제 데이터 연동 필요)
    const fetchData = async () => {
      const response = await fetch(`/api/distance-spots?page=${currentPage}`);
      const data = await response.json();
      setSpots(data.spots);
    };
    fetchData();
  }, [currentPage]);

  return (
    <div className="container mx-auto px-8 py-6 bg-gray-50 rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Matnavi</h1>

      {/* 상단 지도 및 지역 리스트 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 지도 영역 */}
        <div className="col-span-2 bg-gray-200 rounded p-4">
          <DestinationMap spots={spots} />
        </div>

        {/* 지역 리스트 영역 */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">지역 리스트</h2>
          <ul className="list-disc list-inside">
            <li>지역 1</li>
            <li>지역 2</li>
            <li>지역 3</li>
          </ul>

          {/* 정렬 선택 */}
          <select className="mt-4 border rounded p-2 w-full">
            <option>거리순</option>
            <option>추천순</option>
          </select>
        </div>
      </div>

      {/* 여행지 카드 영역 */}
      <div className="mt-8 space-y-4">
        {spots.length > 0 ? (
          spots.map((spot, idx) => (
            <TouristSpotCard key={idx} spot={spot} />
          ))
        ) : (
          <p className="text-center text-gray-500">여행지를 불러오는 중입니다...</p>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={3} // 임의 설정, 실제 데이터와 연결 필요
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
