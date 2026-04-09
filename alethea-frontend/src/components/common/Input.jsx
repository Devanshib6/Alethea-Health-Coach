const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, fontFamily: 'sans-serif' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          border: 'none',
          borderBottom: `2px solid ${c.dark}`,
          padding: '10px 0',
          fontSize: 15,
          fontFamily: 'sans-serif',
          color: c.dark,
          outline: 'none',
          backgroundColor: 'transparent',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  )
}

export default Input