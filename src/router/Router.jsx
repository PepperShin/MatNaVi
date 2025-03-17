import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../UI/layouts/MainLayout';
import TripInfoPage from '../UI/pages/TripInfoPage';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { createAPIUrl } from '../common/commonUrl';
import { useEffect, useState } from 'react';

const TourInfoContent = () => {
  // URL에서 keyword 가져오기
  const { keyword, contentId } = useParams(); // param 어떻게 할지 정하기
  
  // contentid 넘겨받는다는 전제하에 
  // TEST
  const [ id, setId ] = useState(0);
  useEffect(() => {
    var code = {
      areaCode: 0,
      sigunguCode: 0,
    };

    const getAreaCode = async () => {
      try {
        const response = await axios.get(createAPIUrl("areaCode1"));
        if (response.data.response.header.resultMsg === 'OK') {
          for (const item of response.data.response.body.items.item) {
            if (item.name.toString() === keyword.toString()) {
              code.areaCode = item.code;
              return item.code;
            }
          }
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
    
    const getSigunguCode = async () => {
      try {
        const response = await axios.get(createAPIUrl("areaCode1", {
          areaCode : await getAreaCode(),
        }));
        if (response.data.response.header.resultMsg === 'OK') {
          var cnt = 0
          for (const item of response.data.response.body.items.item) {
            cnt ++;
            if (cnt == 3) {
              code.sigunguCode = item.code;
              return item.code;
            }    
          }
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
  
    const getContentId = async () => {
      await getSigunguCode();
      try {
        const response = await axios.get(createAPIUrl("areaBasedList1", {
          arrange: "A",
          contentTypeId: 32,
          areaCode: code.areaCode,
          sigunguCode: code.sigunguCode,
        })); //다른 여행지 정보
  
        if (response.data.response.header.resultMsg === 'OK') {
          for (const item of response.data.response.body.items.item) {
            setId(item.contentid);
          }    
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }

    getContentId();
  }, [])
  // TEST DONE

  return <TripInfoPage keyword={keyword} contentId={id}/>;
};

const routes = [
  {
    path: '/',
    element: <MainLayout />, // 기본 레이아웃
    children: [
      {
        path: '/tour/:keyword',// 지역명 검색 시 렌더링
        // path: '/tour/:keyword/:contentId',// 지역명 + contentid
        element: <TourInfoContent />, 
      },
      {
        path: '*', // 404 페이지 처리
        element: <h2>페이지를 찾을 수 없습니다.</h2>,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export { router };