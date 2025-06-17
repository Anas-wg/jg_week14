import axios from "axios";
import useAuthStore from "../stores/authStore"; // Zustand로 로그인 상태 관리

// 1. 기본 URL과 헤더를 포함하는 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // API 기본 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 요청 인터셉터 (Request Interceptor)
//    : 모든 API 요청이 보내지기 전에 먼저 실행됩니다.
apiClient.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 accessToken을 가져옵니다.
    const { accessToken } = useAuthStore.getState();

    // 토큰이 있다면, 요청 헤더에 Authorization을 추가합니다.
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터 (Response Interceptor)
apiClient.interceptors.response.use(
  // 성공적인 응답은 그대로 통과시킵니다.
  (response) => response,
  // 에러가 발생한 응답을 처리합니다.
  (error) => {
    // 만약 에러 응답이 있고, 상태 코드가 419(토큰 만료) 또는 401(권한 없음)이라면
    if (
      error.response &&
      (error.response.status === 419 || error.response.status === 401)
    ) {
      // Zustand 스토어의 logout 함수를 호출하여 전역 상태를 초기화합니다.
      useAuthStore.getState().logout();

      // 사용자에게 알리고 로그인 페이지로 리디렉션합니다.
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/signin";
    }

    // 처리된 에러는 다음으로 넘겨서 다른 곳에서 추가 처리를 할 수 있게 합니다.
    return Promise.reject(error);
  }
);

export default apiClient;
