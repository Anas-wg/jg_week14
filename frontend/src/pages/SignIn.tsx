import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // react-router-dom에서 import
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import { useFormValidation } from "../hooks/useFormValidate";
import { login as apiLogin } from "../api/auth"; // 로그인 API 함수 불러오기
import main_logo from "../assets/banner_logo.png";
import google_logo from "../assets/google.svg";
import useAuthStore from "../stores/authStore";

const SignIn: React.FC = () => {
  const { values, handleChange, validateForm } = useFormValidation({
    email: "",
    password: "",
  });

  // 1. 폼 전체의 에러 메시지를 관리할 새로운 state
  const [formError, setFormError] = useState<string | null>(null);

  const { login } = useAuthStore(); // 스토어에서 login 함수를 가져옵니다.

  const navigate = useNavigate();

  // 2. handleSubmit 함수를 async로 변경하고, API 호출 로직 추가
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null); // 이전 에러 메시지 초기화

    if (!validateForm()) {
      // 클라이언트 측 유효성 검사 실패 시 (예: 이메일 형식 오류)
      // 에러를 표시하지 않고 그냥 중단
      console.log("클라이언트 유효성 검사 실패");
      return;
    }

    try {
      // 유효성 검사를 통과하면 로그인 API 호출
      // const data = await login(values);
      const data = await apiLogin(values);
      login(data.accessToken);
      console.log("로그인 성공:", data);

      // TODO: 발급받은 accessToken(data.accessToken)을 로컬 스토리지 등에 저장하는 로직 필요

      alert("로그인 성공!");
      navigate("/"); // 메인 페이지로 이동
    } catch (err) {
      // API 호출 실패 시 (예: 비밀번호 틀림)
      if (err instanceof Error) {
        setFormError(err.message); // state에 에러 메시지 저장
        console.log("로그인 API 호출 실패:", err.message);
      } else {
        setFormError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <NavLink to="/">
        <div className="mb-12 text-center">
          <img
            className="mx-auto h-24 w-auto"
            src={main_logo}
            alt="The Board Logo"
          />
          <h1 className="mt-6 text-4xl font-normal text-black">The Board.</h1>
        </div>
      </NavLink>

      {/* 3. formError 상태에 따라 다른 메시지를 보여줌 */}
      {formError ? (
        <p className="mb-8 font-bold text-red-500">{formError}</p>
      ) : (
        <p className="mb-8 font-bold text-blue-800">
          안녕하세요, 14주차 게시판 과제 페이지 입니다.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-6">
        {/* 4. InputField에서 errorMessage prop 제거 */}
        <InputField
          label="ID"
          type="email"
          name="email"
          placeholder="abcd@naver.com"
          value={values.email}
          onChange={handleChange}
        />
        <InputField
          label="PASSWORD"
          type="password"
          name="password"
          placeholder="Enter Your PW"
          value={values.password}
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <Button
            onSubmit={() => handleSubmit}
            variant="primary"
            type="submit"
            size="md"
          >
            로그인
          </Button>
          <NavLink to="/signup">
            <Button variant="secondary" size="md">
              회원가입
            </Button>
          </NavLink>
        </div>
        <Button
          className="flex items-center justify-center gap-4"
          variant="no_background"
          size="lg"
        >
          <img src={google_logo} alt="Google logo" />
          Sign in with Google
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
