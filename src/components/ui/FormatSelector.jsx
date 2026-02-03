import { useState, useRef, useEffect } from 'react';
import '../../styles/formatSelector.css';

export default function FormatSelector ({value = 'image/png', onChange, svgPreset = 'logo-clean', onSvgPresetChange}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSvgOpen, setIsSvgOpen] = useState(false);
  const [submenuSide, setSubmenuSide] = useState('right');
  const dropdownRef = useRef(null);
  const svgOptionRef = useRef(null);

  const formatOptions = [
    { value: 'image/webp', label: 'WEBP' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/svg+xml', label: 'SVG' }
  ];

  const svgOptions = [
    { value: 'logo-clean', label: 'Logo' },
    { value: 'icon-flat', label: 'Icono' },
    { value: 'illustration', label: 'Ilustración' },
    { value: 'sketch', label: 'Boceto' },
    { value: 'high-detail', label: 'Detalle+' },
    { value: 'black-white', label: 'B/N' },
    { value: 'pixel-art', label: 'Pixel' }
  ];

  const selectedFormat =
    formatOptions.find(opt => opt.value === value) || formatOptions[2];

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleFormatSelect = (optionValue) => {
    onChange?.(optionValue);
    if (optionValue !== 'image/svg+xml') {
      setIsOpen(false);
      setIsSvgOpen(false);
    } else {
      setIsSvgOpen(true);
    }
  };

  const handleSvgSelect = (optionValue) => {
    onSvgPresetChange?.(optionValue);
    onChange?.('image/svg+xml');
    setIsSvgOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isSvgOpen || !svgOptionRef.current) return;
    const rect = svgOptionRef.current.getBoundingClientRect();
    const estimatedSubmenuWidth = 220;
    const spaceRight = window.innerWidth - rect.right;
    setSubmenuSide(spaceRight >= estimatedSubmenuWidth ? 'right' : 'left');
  }, [isSvgOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsSvgOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="format-select-wrapper" ref={dropdownRef}>
      <select
        className="input-control js-convert-to"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ display: 'none' }}
      >
        <option value="image/webp">WEBP</option>
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/svg+xml">SVG</option>
      </select>

      <button
        type="button"
        className={`format-select-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <span className="format-select-label">{selectedFormat.label}</span>
        <svg
          className="format-select-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
        </svg>
      </button>

      {value === 'image/svg+xml' && svgPreset && (
        <div className={`svg-preset-badge ${!isOpen ? 'visible' : ''}`}>
          {svgOptions.find(o => o.value === svgPreset)?.label}
        </div>
      )}

      {isOpen && (
        <div className="format-select-dropdown">
          {formatOptions.map((option) => {
            const isSvg = option.value === 'image/svg+xml';
            return (
              <div
                key={option.value}
                ref={isSvg ? svgOptionRef : null}
                data-format={option.label.toLowerCase()}
                className={`format-select-option 
                  ${option.value === value ? 'selected' : ''} 
                  ${isSvg ? 'has-submenu' : ''} 
                  ${isSvg && isSvgOpen ? 'open' : ''}`}
                onMouseEnter={() => isSvg && setIsSvgOpen(true)}
                onClick={() => handleFormatSelect(option.value)}
              >
                <span>{option.label}</span>

                {isSvg && (
                  <>
                    <svg
                      className="submenu-caret"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
                    </svg>

                    {isSvgOpen && (
                      <div
                        className={`svg-submenu svg-submenu--${submenuSide} open`}
                        onMouseEnter={() => setIsSvgOpen(true)}
                        onMouseLeave={() => setIsSvgOpen(false)}
                      >
                        {svgOptions.map(opt => (
                          <div
                            key={opt.value}
                            className={`svg-submenu-option ${opt.value === svgPreset ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSvgSelect(opt.value);
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};