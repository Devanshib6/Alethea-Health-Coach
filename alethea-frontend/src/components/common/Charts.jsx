const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

export const BarChart = ({ data = [], color = c.dark, height = 100 }) => {
  if (!data.length) return <p style={{ color: c.taupe, fontSize: 13, textAlign: 'center' }}>No data</p>
  const max = Math.max(...data.map(d => d.value || 0))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
      {data.map((item, i) => {
        const barH = max ? ((item.value / max) * (height - 20)) + 10 : 10
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: barH, backgroundColor: color, borderRadius: '4px 4px 0 0' }} title={`${item.label}: ${item.value}`} />
            <span style={{ fontSize: 9, color: c.taupe, textAlign: 'center' }}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export const ProgressBar = ({ value, max, color = c.peach, label }) => {
  const pct = max ? Math.min((value / max) * 100, 100) : 0
  return (
    <div>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: c.taupe, fontSize: 12 }}>{label}</span>
        <span style={{ color: c.dark, fontSize: 12, fontWeight: 600 }}>{value}/{max}</span>
      </div>}
      <div style={{ height: 8, backgroundColor: `${c.peach}30`, borderRadius: 4 }}>
        <div style={{ height: 8, backgroundColor: color, borderRadius: 4, width: `${pct}%`, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export default { BarChart, ProgressBar }