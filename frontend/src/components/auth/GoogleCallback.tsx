// frontend/src/pages/GoogleCallback.tsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login); // 스토어 login 함수 가져오기

  useEffect(() => {
    // URL 분리
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      login(token);

      console.log("구글 로그인 성공! 토큰 수신:", token);
      alert("구글 로그인 성공!");
      navigate("/"); // 메인 페이지로 이동
    } else if (error) {
      alert("구글 로그인 실패: " + error);
      navigate("/signin"); // 로그인 페이지로 다시 이동
    } else {
      // 토큰이나 에러가 없는 경우 (잘못된 접근)
      alert("잘못된 접근입니다.");
      navigate("/signin");
    }
  }, [location, login, navigate]);

  return (
    <div>
      <p>구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallback;
