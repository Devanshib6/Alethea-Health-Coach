const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Card = ({ title, value, unit, icon, color }) => {
  return (
    <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 20, backgroundColor: c.white }}>
      {icon && <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>}
      {title && <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{title}</p>}
      {value !== undefined && <p style={{ color: color || c.dark, fontSize: 32, fontWeight: 800, margin: '4px 0 0', lineHeight: 1 }}>{value}</p>}
      {unit && <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>{unit}</p>}
    </div>
  )
}

export default Card