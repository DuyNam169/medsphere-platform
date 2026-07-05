// ============================================================
// Spinner.tsx — src/core/components/Spinner.tsx
// Spinner dùng chung: cho nút bấm, form, hoặc bất kỳ khu vực
// nào đang chờ xử lý (API call, chuyển trang...).
// ============================================================

import React from 'react';

interface SpinnerProps {
  /** Kích thước tính bằng px. Mặc định 16 — phù hợp đặt trong nút bấm. */
  size?: number;
  /** Màu viền spinner. Mặc định 'currentColor' — tự lấy màu chữ của phần tử cha. */
  color?: string;
  /** Độ dày viền. Mặc định 2px. */
  thickness?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 16,
  color = 'currentColor',
  thickness = 2,
  className = '',
}) => {
  return (
    <span
      role="status"
      aria-label="Đang tải"
      className={`inline-block rounded-full animate-spin ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderStyle: 'solid',
        borderColor: color,
        borderTopColor: 'transparent',
        opacity: 0.85,
      }}
    />
  );
};