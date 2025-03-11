//src/components/DestinationMap.jsx
// 지도를 표시하는 컴포넌트 -> 화면 구성 요소소

export default function DestinationMap({ spots }) {
    if (!spots.length) return <div className="text-center text-gray-500">지도를 불러오는 중...</div>;
  
    const markers = spots.map(
      (spot) => `pos:${spot.lon} ${spot.lat}|label:${spot.title}|type:d`
    ).join('&');
  
    const mapUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?center=${spots[0].lon},${spots[0].lat}&level=12&w=600&h=300&markers=${markers}`;
  
    return (
      <img src={mapUrl} alt="여행지 지도" className="rounded shadow w-full h-full object-cover"/>
    );
  }
  