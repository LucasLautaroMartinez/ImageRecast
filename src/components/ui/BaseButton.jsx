import '../../styles/baseButton.css';

export default function BaseButton({
  variant = 'primary',
  type = 'button',
  disabled = false,
  children,
  ...rest
}) {
  const variantClass = `base-button--${variant}`;

  return (
    <button
      className={`base-button ${variantClass}`}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}