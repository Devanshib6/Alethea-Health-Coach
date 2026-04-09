const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = c.dark }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: c.white, borderRadius: 12, padding: 32, maxWidth: 400, width: '90%' }}>
        <h3 style={{ color: c.dark, marginBottom: 12, fontWeight: 800 }}>{title}</h3>
        <p style={{ color: c.taupe, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, borderRadius: 8, cursor: 'pointer', color: c.taupe, fontSize: 14 }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', backgroundColor: confirmColor, color: c.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal