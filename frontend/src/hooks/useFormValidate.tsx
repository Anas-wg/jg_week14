/* eslint-disable prefer-const */
import { useState, useCallback } from "react";

// 유효성 검사 규칙을 정의하는 validate
const validate = (name: string, value: string) => {
  switch (name) {
    case "email": {
      const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (!value || !emailRegex.test(value)) {
        return "이메일 형식으로 작성해주세요."; // 명세서 요구사항
      }
      return "";
    }

    case "password": {
      // 비밀번호 형식: 영문, 숫자를 혼합하여 8자 이상
      const passwordRegex = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      );
      if (!value || !passwordRegex.test(value)) {
        return "영문, 숫자, 특수문자를 혼합하여 8자 이상으로 입력해주세요."; // 명세서 요구사항
      }
      return "";
    }

    case "none": {
      return "";
    }
    default:
      return "";
  }
};

// 커스텀 훅 정의
// 제네릭 개념 활용, T로 타입을 받아서 기록
export const useFormValidation = <T extends Record<string, string>>(
  initialState: T
) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  // 입력값이 변경될 때마다 상태와 에러를 업데이트하는 핸들러 함수
  // e.target에서 값 추출
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // e.target에서 값 추출

    // 값 업데이트
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // 유효성 검사 및 에러 메시지 업데이트
    const errorMessage = validate(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  }, []);

  // 폼 제출 시 전체 유효성을 다시 한번 검사하는 함수
  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    for (const key in values) {
      const errorMessage = validate(key, values[key]);
      if (errorMessage) {
        isValid = false;
        newErrors[key] = errorMessage;
      }
    }
    setErrors(newErrors as T);
    return isValid;
  };
  // 반환값
  return {
    values,
    errors,
    handleChange,
    validateForm,
    setValues,
  };
};
