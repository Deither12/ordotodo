export default function Topbar({ title, user }) {
  const initial = user?.firstName?.[0]?.toUpperCase() || 'A'
  return (
    <div className="glass-topbar" style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 15, color: '#f0e8e8', letterSpacing: '3px', textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {['◎', '⚙'].map(ic => (
          <div key={ic} className="icon-btn">{ic}</div>
        ))}
        <div
          className="animate-glow-pulse"
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(192,0,12,0.12)', border: '1px solid #8b0000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cinzel',serif", fontWeight: 700, color: '#ff2222', fontSize: 13, cursor: 'pointer',
          }}
        >{initial}</div>
      </div>
    </div>
  )
}
