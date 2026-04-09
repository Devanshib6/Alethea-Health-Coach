const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Footer = () => {
  return (
    <footer style={{ backgroundColor: c.dark, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <span style={{ color: c.white, fontWeight: 900, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase' }}>Alethea</span>
      <p style={{ color: c.taupe, fontSize: 12, fontFamily: 'sans-serif' }}>© 2024 Alethea Health Coach — Final Year Project</p>
    </footer>
  )
}

export default Footer