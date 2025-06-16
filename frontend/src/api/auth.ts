import { type UserSignupData } from "../types/user"; // 회원가입 데이터 타입을 불러옵니다 (아래에서 정의).
import { type UserSigninData } from "../types/user";

const API_BASE_URL = "http://localhost:3000/api"; // 백엔드 API 기본 주소

// 회원가입 요청을 보내는 함수
export const signup = async (userData: UserSignupData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // fetch는 4xx, 5xx 에러를 자동으로 throw하지 않으므로,
  // response.ok가 false일 때 수동으로 에러를 발생시켜야 합니다.
  if (!response.ok) {
    const errorData = await response.json(); // 백엔드에서 보낸 에러 메시지를 포함
    throw new Error(errorData.error || "회원가입에 실패했습니다.");
  }

  // 성공 시, 백엔드에서 보낸 응답 데이터를 JSON으로 변환하여 반환
  return response.json();
};

// 로그인 요청을 보내는 함수
export const login = async (userData: UserSigninData) => {
  const response = await fetch(`http://localhost:3000/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // 백엔드에서 보낸 에러 메시지를 그대로 전달
    throw new Error(errorData.error || "로그인에 실패했습니다.");
  }
  console.log(response);

  return response.json(); // 성공 시 { accessToken, user } 객체 반환
};
