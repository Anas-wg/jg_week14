import { create } from "zustand";
import { persist } from "zustand/middleware"; // persist 미들웨어 import

// 스토어의 상태와 액션에 대한 타입을 정의합니다.
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

// 스토어를 생성합니다.
const useAuthStore = create(
  // persist 미들웨어를 사용하여 스토어 상태를 로컬 스토리지에 저장합니다.
  persist<AuthState>(
    (set) => ({
      // 초기 상태
      accessToken: null,
      user: null,
      isLoggedIn: false,
      _hasHydrated: false, // 초기값은 false

      // 로그인 액션: 토큰을 받아서 상태를 업데이트합니다.
      login: (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        // --- 이 부분을 수정합니다 ---
        // atob는 Latin-1을 기준으로 디코딩하므로, 유니코드 문자열에 문제가 생길 수 있습니다.
        // TextDecoder를 사용하여 명시적으로 UTF-8로 디코딩합니다.
        const decodedString = atob(base64);

        const bytes = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
          bytes[i] = decodedString.charCodeAt(i);
        }
        // UTF-8로 최종 디코딩
        const jsonPayload = new TextDecoder("utf-8").decode(bytes);
        // --- 수정 끝 ---

        const payload = JSON.parse(jsonPayload);

        console.log("--- JWT 디코딩 결과 (store.ts) ---");
        console.log("payload:", payload);
        console.log("userId:", payload.userId);
        console.log("nickname:", payload.nickname);
        console.log("-----------------------------------");

        set({
          accessToken: token,
          user: {
            userId: payload.userId,
            nickname: payload.nickname,
          },
          isLoggedIn: true,
        });
      },

      // 로그아웃 액션: 모든 상태를 초기값으로 리셋합니다.
      logout: () => {
        set({
          accessToken: null,
          user: null,
          isLoggedIn: false,
        });
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 때 사용될 키 이름
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(true);
      },
    }
  )
);

export default useAuthStore;
