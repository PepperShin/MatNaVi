// API URL 생성 함수
export const createAPIUrl = (path, params = {}) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const apiKey = import.meta.env.VITE_TOUR_API_KEY;

    const url = new URL(`${baseURL}/${path}`);
    url.searchParams.append("serviceKey", apiKey);

    // 기본 파라미터 설정
    const defaultParams = {
      numOfRows: 10,
      pageNo: 1,
      MobileOS: "AND",
      MobileApp: "AppTest",
      _type: "json",
      ...params, // 추가 파라미터 병합
    };

    // 파라미터를 URL에 추가
    Object.entries(defaultParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.toString(); // 최종 URL 반환
  };