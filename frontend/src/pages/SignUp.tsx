import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useFormValidation } from "../hooks/useFormValidate";
import { signup } from "../api/auth";
import { type UserSignupData } from "../types/user";
import main_logo from "../assets/banner_logo.png";
import { NavLink } from "react-router";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, validateForm } =
    useFormValidation<UserSignupData>({
      email: "",
      password: "",
      nickname: "",
    });

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!validateForm()) {
      console.log("폼 유효성 검사 실패");
      return;
    }

    try {
      const data = await signup(values);

      console.log("회원가입 성공:", data);
      alert(data.message || "회원가입이 완료되었습니다.");

      navigate("/signin");
    } catch (err) {
      if (err instanceof Error) {
        console.error("회원가입 실패:", err);
        alert(err.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <div className="mb-12 text-center">
        <img
          className="mx-auto h-24 w-auto"
          src={main_logo}
          alt="The Board Logo"
        />
        <h1 className="mt-6 text-4xl font-normal text-black">The Board.</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="E-mail"
          type="email"
          name="email"
          placeholder="abcd@naver.com"
          value={values.email}
          onChange={handleChange}
          errorMessage={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="영문, 숫자, 특수문자 8자 이상"
          value={values.password}
          onChange={handleChange}
          errorMessage={errors.password}
        />
        <InputField
          label="NickName"
          type="text"
          name="nickname"
          placeholder="사용할 별명을 입력해주세요."
          value={values.nickname}
          onChange={handleChange}
          errorMessage={errors.nickname}
        />
        <div className="flex gap-4">
          <NavLink to="/signin">
            <Button variant="secondary" size="md">
              취소
            </Button>
          </NavLink>
          <Button type="submit" variant="primary" size="md">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
