import axios from "axios";

// 네이버 검색 api

// 식당 검색
export async function get_restaurant(location){
    // api 호출 세팅
    const naver = "/v1/search/local.json";
    const options = {
        headers: {
            "X-Naver-Client-Id": import.meta.env.VITE_NAVER_ID,
            "X-Naver-Client-Secret": import.meta.env.VITE_NAVER_KEY,
        },
        params: {
            query: `${location} 주변 식당`,
            display: 5
        }
    };

    // 엑시오스로 api 값 리턴.
    return await axios.get(naver, options)
    .then((response) => {
        const data = response.data;
        if (data.items && data.items.length > 0){

            return data;
        }
        else {
            return "결과가 없습니다.";
        }
    })
    .catch((error) => {
        console.error(" Naver search API 요청 실패:", error);
        return null;
    })
};

// 숙소 검색
export async function get_lodging(location){
    // api 호출 세팅
    const naver = "/v1/search/local.json";
    const options = {
        headers: {
            "X-Naver-Client-Id": import.meta.env.VITE_NAVER_ID,
            "X-Naver-Client-Secret": import.meta.env.VITE_NAVER_KEY,
        },
        params: {
            query: `${location} 주변 숙소`,
            display: 5
        }
    };

    // 엑시오스로 api 값 리턴.
    return await axios.get(naver, options)
    .then((response) => {
        const data = response.data;
        if (data.items && data.items.length > 0){
            return data;
        }
        else {
            return "결과가 없습니다.";
        }
      
    })
    .catch((error) => {
        console.error(" Naver search API 요청 실패:", error);
        return null;
    })
}