import React from "react";
import main_logo from "../../assets/banner_logo.png";

const MainBanner: React.FC = () => {
  return (
    <div>
      <div className="w-[974px] h-80 relative">
        <div className="w-[974px] h-80 left-0 top-0 absolute bg-[conic-gradient(from_253deg_at_79.13%_57.66%,_#CFE3FE_29deg,_#E0EEFF_293deg,_#ACCBFD_360deg)] rounded-2xl" />
        <img
          className="w-72 h-72 left-[643.47px] top-[10.65px] absolute"
          src={main_logo}
        />
        <div className="w-48 left-[64px] top-[193.01px] absolute justify-start text-blue-800 text-base font-bold font-['Pretendard']">
          14주차 게시판 만들기 과제
        </div>
        <div className="w-60 left-[64px] top-[222.01px] absolute justify-start text-blue-800 text-base font-normal font-['Pretendard']">
          React와 TypeScript를 활용해 FE를, node.js를 활용해 BE를 구현했습니다
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
