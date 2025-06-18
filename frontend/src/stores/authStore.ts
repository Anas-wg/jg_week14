import { create } from "zustand";
import { persist } from "zustand/middleware"; // 영구적 저장용 미들웨어 import

// 사용자 인증상태 인터페이스 정의
interface AuthState {
  accessToken: string | null;
  user: {
    userId: number;
    nickname: string;
  } | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// 스토어를 생성
const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // 초기 상태
      accessToken: null,
      user: null,
      isLoggedIn: false,
      _hasHydrated: false,

      // 로그인 액션: 토큰을 받아서 사용자 로그인 상태 업데이트
      login: (token) => {
        // token decoding으로 User 정보 얻어내기
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const decodedString = atob(base64);

        const bytes = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
          bytes[i] = decodedString.charCodeAt(i);
        }
        const jsonPayload = new TextDecoder("utf-8").decode(bytes);

        const payload = JSON.parse(jsonPayload);

        // 얻어낸 정보 Zustand Store에 저장
        set({
          accessToken: token,
          user: {
            userId: payload.userId,
            nickname: payload.nickname,
          },
          isLoggedIn: true,
        });
      },

      // Logout시 모두 초기화
      logout: () => {
        set({
          accessToken: null,
          user: null,
          isLoggedIn: false,
        });
      },
      // persisted state로 저장 => 로그인 여부를 기억
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      // 로컬 스토리지에 저장
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(true);
      },
    }
  )
);

export default useAuthStore;
