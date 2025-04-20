import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/logo.png" // Đảm bảo ảnh của bạn là public/logo.png
        alt="Ngọ Lâm"
        className="h-12 w-auto"
      />
      <span className="mt-1 text-green-700 font-bold text-sm">Ngọ Lâm</span>
    </div>
  );
};

export default Logo;
