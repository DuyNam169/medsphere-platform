// ============================================================
// PhoneInput.tsx — src/core/components/PhoneInput.tsx
// ============================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { countries, defaultCountry, type Country } from '../data/countries';

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onChange: (localNumber: string, countryCode: string) => void;
  error?: string;
  placeholder?: string;
  id?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  countryCode,
  onChange,
  error,
  placeholder,
  id,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry: Country =
    countries.find((c) => c.code === countryCode) || defaultCountry;

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.trim().toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      searchInputRef.current?.focus();
    }
  }, [dropdownOpen]);

  const handleCountrySelect = (country: Country) => {
    onChange(value, country.code);
    setDropdownOpen(false);
    setSearch('');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^\d]/g, '');
    onChange(digitsOnly, countryCode);
  };

  return (
    <div className="phone-input-wrapper" ref={dropdownRef}>
      <div className={`phone-input__group${error ? ' phone-input__group--error' : ''}`}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="phone-input__country-btn"
        >
          <span className="phone-input__flag">{selectedCountry.flag}</span>
          <span className="phone-input__dial-code">{selectedCountry.dialCode}</span>
          <span className="phone-input__caret">▾</span>
        </button>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className="phone-input__number"
        />
      </div>

      {dropdownOpen && (
        <div className="phone-input__dropdown">
          <div className="phone-input__search-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm quốc gia..."
              className="phone-input__search"
            />
          </div>
          <div className="phone-input__list">
            {filteredCountries.length === 0 ? (
              <div className="phone-input__no-result">Không tìm thấy</div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="phone-input__dropdown-item"
                >
                  <span className="phone-input__flag">{country.flag}</span>
                  <span className="phone-input__country-name">{country.name}</span>
                  <span className="phone-input__dial-code-item">{country.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};