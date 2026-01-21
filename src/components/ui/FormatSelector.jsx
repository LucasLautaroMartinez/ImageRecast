import { useState, useRef, useEffect } from 'react';
import '../../styles/formatSelect.css';

const FormatSelect = ({ value = 'image/png', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'image/webp', label: 'WEBP' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/png', label: 'PNG' }
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[2];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="format-select-wrapper" ref={dropdownRef}>
      {/* Select nativo oculto para mantener la funcionalidad */}
      <select 
        className="input-control js-convert-to" 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ display: 'none' }}
      >
        <option value="image/webp">WEBP</option>
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
      </select>

      {/* Botón personalizado */}
      <button
        type="button"
        className={`format-select-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <span className="format-select-label">{selectedOption.label}</span>
        <svg
          className="format-select-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
        </svg>
      </button>

      {/* Dropdown personalizado */}
      {isOpen && (
        <div className="format-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`format-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormatSelect;