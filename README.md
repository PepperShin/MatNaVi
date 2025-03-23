
### api 키 이름 

// 한국 관광 공사 인코딩 키
VITE_TOUR_ENCODING_KEY

// 한국 관광 공사 디코딩 키
VITE_TOUR_DECODING_KEY

// 네이버 지도 
VITE_NAVER_MAP_CLIENT_ID
VITE_NAVER_MAP_CLIENT_SECRET

// 네이버 검색
VITE_NAVER_SEARCH_CLIENT_ID
VITE_NAVER_SEARCH_CLIENT_SECRET


### 라우팅

{
    path: '/regional/:province/:city',
    element: <RegionalPage />
},

전 페이지(파트1)에서 넘어올 때 '/regional/도/시군구' 형식으로 넘어오는 걸로 했습니다.
이름으로 하려니까 같은 이름들이 많아서 여행지 찾기가 어렵더라구요.
검색창도 셀렉트 박스로 바꿨습니다.
코딩하느라 '/'로 들어오면 경기도 수원시를 검색한 페이지로 넘어가게 해놨어요

{
    path: '/',
    element: <Navigate to="/regional/경기도/수원시" replace />, // 기본 경로에서 자동 이동
},
이거 삭제하시면 됩니다.
감사합니다.