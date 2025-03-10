import React, { useEffect } from 'react'

const NaverMap = () => {
  useEffect(() => {
    // 네이버 지도 API 로드
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=pbin66712j`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      // 네이버 지도 API가 로드된 후 실행할 코드
      const cityhall = new naver.maps.LatLng(37.5666805, 126.9784147)
      const map = new naver.maps.Map('map', {
        center: cityhall.destinationPoint(0, 500),
        zoom: 15,
      })
      const marker = new naver.maps.Marker({
        map: map,
        position: cityhall,
      })

      const contentString = [
        '<div class="iw_inner">',
        '   <h3>서울특별시청</h3>',
        '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
        '       <img src="/img/example/hi-seoul.jpg" width="55" height="55" alt="서울시청" class="thumb" /><br />',
        '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
        '       <a href="http://www.seoul.go.kr/" target="_blank">www.seoul.go.kr/</a>',
        '   </p>',
        '</div>',
      ].join('')

      const infowindow = new naver.maps.InfoWindow({
        content: contentString,
      })

      naver.maps.Event.addListener(marker, 'click', function (e) {
        if (infowindow.getMap()) {
          infowindow.close()
        } else {
          infowindow.open(map, marker)
        }
      })

      infowindow.open(map, marker)
    }

    return () => {
      // 클린업: 컴포넌트가 unmount될 때 script 태그를 제거
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div>
      <div id='map' style={{ width: '100%', height: '400px' }}></div>
    </div>
  )
}

export default NaverMap