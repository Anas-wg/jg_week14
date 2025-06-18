import apiClient from "./client";
import { type UserSignupData, type UserSigninData } from "../types/user";

// 회원가입 요청
export const signup = async (userData: UserSignupData) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};

// 로그인 요청
export const login = async (userData: UserSigninData) => {
  const response = await apiClient.post("/auth/login", userData);
  return response.data;
};
