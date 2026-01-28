import { useState, useRef, useEffect } from 'react';
import '../../styles/svgOptionSelector.css';

const SvgOptionSelector = ({ preset = 'logo-clean', onPresetChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'logo-clean', label: 'Logo' },
    { value: 'icon-flat', label: 'Icono' },
    { value: 'illustration', label: 'Ilustración' },
    { value: 'sketch', label: 'Boceto' },
    { value: 'high-detail', label: 'Detalle+' },
    { value: 'black-white', label: 'B/N' },
    { value: 'pixel-art', label: 'Pixel' }
  ];

  const selectedOption = options.find(opt => opt.value === preset) || options[0];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    if (onPresetChange) {
      onPresetChange(optionValue);
    }
    setIsOpen(false);
  };

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
    <div className="svg-option-select-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`svg-option-select-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <span className="format-select-label">
          Estilo: {selectedOption.label}
        </span>
        <svg
          className="svg-option-select-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
        </svg>
      </button>

      {isOpen && (
        <div className="svg-option-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              data-svg-option={option.value}
              className={`svg-option-select-option ${option.value === preset ? 'selected' : ''}`}
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

export default SvgOptionSelector;