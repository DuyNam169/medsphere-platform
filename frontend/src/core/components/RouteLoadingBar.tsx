// ============================================================
// RouteLoadingBar.tsx — src/core/components/RouteLoadingBar.tsx
// Thanh loading mỏng ở đầu trang, hiện mỗi khi URL thay đổi.
// Dùng animation trượt qua lại liên tục (indeterminate),
// không đếm phần trăm cụ thể — giống kiểu YouTube/Google.
//
// LƯU Ý: component này PHẢI được đặt bên trong <BrowserRouter>,
// vì nó dùng useLocation() để phát hiện thời điểm đổi route.
// Animation "route-loading-slide" được định nghĩa trong index.css.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Thời gian tối thiểu thanh loading hiển thị (ms).
// Nếu trang chuyển quá nhanh, vẫn giữ thanh hiện đủ lâu để
// người dùng kịp nhận ra — nhưng không set quá lâu kẻo gây khó chịu.
const MIN_VISIBLE_DURATION = 500;

export const RouteLoadingBar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Bỏ qua lần render đầu tiên (lúc mới load trang, không phải "chuyển trang")
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hideTimer.current) clearTimeout(hideTimer.current);

    setVisible(true);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, MIN_VISIBLE_DURATION);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-blue-100"
    >
      <div className="route-loading-bar__inner h-full w-1/3 bg-blue-600 rounded-full" />
    </div>
  );
};