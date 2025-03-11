// src/components/TouristSpotCard.jsx
// 여행지 카드 컴포넌트 -> 화면 구성 요소
// 여행지 데이터를 받아 카드 형태로 렌더링하는 컴포넌트

export default function TouristSpotCard({ spot }) {
    return (
      <div className="flex bg-white rounded shadow overflow-hidden">
        <div className="w-40 h-32 bg-gray-300 flex-shrink-0">
          <img src={spot.image || '/placeholder.jpg'} alt={spot.title} className="w-full h-full object-cover"/>
        </div>
        <div className="p-4">
          <h3 className="font-bold">{spot.title}</h3>
          <p className="text-sm text-gray-600">{spot.description}</p>
        </div>
      </div>
    );
  }
  