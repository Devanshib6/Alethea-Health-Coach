const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, fullWidth = false }) => {
  const styles = {
    primary: { backgroundColor: c.dark, color: c.white, border: 'none' },
    secondary: { backgroundColor: 'transparent', color: c.taupe, border: `1.5px solid ${c.peach}` },
    danger: { backgroundColor: '#ef4444', color: c.white, border: 'none' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '12px 24px',
        fontSize: 13,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
        borderRadius: 4,
        transition: 'opacity 0.2s'
      }}>
      {children}
    </button>
  )
}

export default Button