// ============================================================
// OtpInput.tsx — src/packages/auth/components/OtpInput.tsx
// 6-box OTP input với auto-focus, backspace navigation, paste support.
// ============================================================

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setDigit = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setDigit(index, '');
      return;
    }
    // Nếu user paste nhiều số vào 1 ô, phân bổ lần lượt
    if (raw.length > 1) {
      const chars = raw.split('');
      const next = [...digits];
      chars.forEach((c, i) => {
        if (index + i < length) next[index + i] = c;
      });
      onChange(next.join('').slice(0, length));
      const lastFilled = Math.min(index + chars.length, length - 1);
      inputRefs.current[lastFilled]?.focus();
      return;
    }
    setDigit(index, raw);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, '').slice(0, length).replace(/\s/g, ''));
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[Math.max(lastIndex, 0)]?.focus();
  };

  return (
    <div className={`otp-input-group${error ? ' otp-input-group--error' : ''}`}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="otp-input-box"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
};