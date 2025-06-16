// Header.tsx
import React, { useEffect } from "react"; // useEffect import
import { NavLink } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import Button from "./common/Button";

const Header: React.FC = () => {
  // _hasHydrated 상태도 함께 가져옵니다.
  const { isLoggedIn, user, logout, _hasHydrated } = useAuthStore(); // user를 다시 가져옵니다.

  // 이 useEffect는 사실 store.ts의 onRehydrateStorage가 올바르게 작동한다면 필수는 아닙니다.
  // 하지만 혹시 모를 경우를 대비하여 hydration 상태를 수동으로 설정하는 fallback으로 둘 수 있습니다.
  // 실제 production에서는 onRehydrateStorage가 충분하므로 제거해도 무방합니다.
  // useEffect(() => {
  //   if (!_hasHydrated) {
  //     // setHasHydrated(true); // 이 부분은 이제 store.ts에서 처리합니다.
  //   }
  // }, [_hasHydrated]);

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
  };

  const activeClassName = "text-black text-xl font-bold font-['Brown']";
  const inactiveClassName =
    "text-stone-400 text-xl font-normal font-['Brown'] hover:text-black";

  return (
    <header className="w-full flex justify-between items-center py-4 px-8">
      <NavLink
        to="/"
        className="text-black text-3xl font-normal font-['Brown']"
      >
        The Board.
      </NavLink>

      <nav className="flex justify-center items-center gap-12">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? activeClassName : inactiveClassName
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            isActive ? activeClassName : inactiveClassName
          }
        >
          Boards
        </NavLink>
        <NavLink
          to="/tbd"
          className={({ isActive }) =>
            isActive ? activeClassName : inactiveClassName
          }
        >
          TBD
        </NavLink>
      </nav>

      {/* _hasHydrated가 true이고, isLoggedIn이 true일 때만 닉네임 부분을 렌더링합니다. */}
      {_hasHydrated && isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="font-bold">
            {/* user가 존재하고 nickname이 있을 때만 표시, 없으면 "환영합니다!" */}
            {user?.nickname ? `${user.nickname}님, 환영합니다!` : "환영합니다!"}
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        <div>
          <NavLink
            to="/signin"
            className="flex h-10 w-24 items-center justify-center rounded-[5px] bg-[#0642AB] font-['Brown'] text-white transition-colors hover:bg-blue-800"
          >
            Sign In
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
