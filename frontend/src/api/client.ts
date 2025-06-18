import axios from "axios";
import useAuthStore from "../stores/authStore";

// axios 모듈화
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // API 기본 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 accessToken 획득.
    const { accessToken } = useAuthStore.getState();

    // 토큰이 있다면, 요청 헤더에 Authorization을 추가.
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token 만료(419), 권한 없음(401) => 토큰 이슈
    if (
      error.response &&
      (error.response.status === 419 || error.response.status === 401)
    ) {
      // Zustand의 로그아웃 액션 호출 => 초기화
      useAuthStore.getState().logout();

      // 로그인 페이지로 리디렉션
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/signin";
    }

    // 모둘화 통해 이 모듈을 사용하는 곳에서 에러처리하기 위해 넘겨줌
    return Promise.reject(error);
  }
);

export default apiClient;
