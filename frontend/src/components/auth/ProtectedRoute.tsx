import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // isLoggedIn 상태가 false이면 (로그아웃 상태)
    if (!isLoggedIn) {
      // 사용자에게 알림을 보여주고, 로그인 페이지로 리디렉션합니다.
      alert("로그인이 필요한 기능입니다.");
      navigate("/signin", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 로그인 상태라면, 자식 컴포넌트(요청한 페이지)를 그대로 보여줍니다.
  // 로그아웃 상태라면, 리디렉션이 실행되기 전까지 잠시 아무것도 보여주지 않습니다.
  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
