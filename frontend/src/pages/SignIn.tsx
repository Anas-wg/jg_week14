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

  const [formError, setFormError] = useState<string | null>(null);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handlegoogleLogin = () => {
    window.location.href = "http://localhost:3000/login";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null); // 이전 에러 메시지 초기화

    if (!validateForm()) {
      alert("잘못된 ID/비밀번호 입니다.");
      console.log("클라이언트 유효성 검사 실패");
      return;
    }

    try {
      const data = await apiLogin(values);
      login(data.accessToken);
      console.log("로그인 성공:", data);

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
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

      {formError ? (
        <p className="mb-8 font-bold text-red-500">{formError}</p>
      ) : (
        <p className="mb-8 font-bold text-blue-800">
          안녕하세요, 14주차 게시판 과제 페이지 입니다.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          onClick={handlegoogleLogin}
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
