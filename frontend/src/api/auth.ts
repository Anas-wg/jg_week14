import apiClient from "./client"; // fetch 대신 apiClient를 사용
import { type UserSignupData, type UserSigninData } from "../types/user";

// 회원가입 요청
export const signup = async (userData: UserSignupData) => {
  // apiClient가 자동으로 baseURL과 헤더를 관리해줍니다.
  const response = await apiClient.post("/auth/signup", userData);
  return response.data; // axios는 응답 데이터를 data 속성에 담아줍니다.
};

// 로그인 요청
export const login = async (userData: UserSigninData) => {
  const response = await apiClient.post("/auth/login", userData);
  return response.data;
};
