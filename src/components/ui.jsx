// ─── Shared UI Primitives ─────────────────────────────────────

export const EyeIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
    <polygon points="20,3 37,37 3,37" fill="none" stroke="#c0000c" strokeWidth="1.5" />
    <circle cx="20" cy="28" r="7" fill="none" stroke="#c0000c" strokeWidth="1.2" />
    <circle cx="20" cy="28" r="3" fill="#c0000c" />
    <line x1="20" y1="3" x2="20" y2="19" stroke="#c0000c" strokeWidth="0.8" opacity="0.4" />
  </svg>
)

export const PentagramBg = () => (
  <svg
    width="180" height="180" viewBox="0 0 180 180"
    style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', opacity: 0.04, pointerEvents: 'none' }}
  >
    <polygon points="90,10 34,170 172,65 8,65 146,170" fill="none" stroke="#ff0000" strokeWidth="1.5" />
    <circle cx="90" cy="90" r="82" fill="none" stroke="#ff0000" strokeWidth="0.8" />
    <circle cx="90" cy="90" r="58" fill="none" stroke="#ff0000" strokeWidth="0.5" />
  </svg>
)

export const RedDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #8b0000)' }} />
    <span style={{ color: '#8b0000', fontSize: 11 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #8b0000)' }} />
  </div>
)

export const Card = ({ children, style = {} }) => (
  <div className="occult-card" style={{ padding: 22, ...style }}>{children}</div>
)

export const RedBtn = ({ children, onClick, style = {}, full = false, type = 'button' }) => (
  <button
    type={type}
    className="red-btn"
    onClick={onClick}
    style={{ width: full ? '100%' : undefined, ...style }}
  >{children}</button>
)

export const OutlineBtn = ({ children, onClick, style = {}, type = 'button' }) => (
  <button type={type} className="outline-btn" onClick={onClick} style={style}>{children}</button>
)

export const DangerBtn = ({ children, onClick, style = {} }) => (
  <button
    type="button"
    className="outline-btn"
    onClick={onClick}
    style={{ borderColor: '#550000', color: '#ff4444', ...style }}
  >{children}</button>
)

export const Label = ({ children, required }) => (
  <label className="occult-label">
    {children}{required && <span style={{ color: '#c0000c', marginLeft: 3 }}>*</span>}
  </label>
)

export const FormGroup = ({ children, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>{children}</div>
)

export const Input = ({ style = {}, error, ...props }) => (
  <div>
    <input
      className="occult-input"
      style={{ borderColor: error ? '#c0000c' : undefined, ...style }}
      {...props}
    />
    {error && <span style={{ color: '#ff2222', fontSize: 11, marginTop: 4, display: 'block' }}>{error}</span>}
  </div>
)

export const Textarea = ({ style = {}, ...props }) => (
  <textarea
    className="occult-input"
    style={{ resize: 'vertical', minHeight: 90, ...style }}
    {...props}
  />
)

export const SelectInput = ({ children, style = {}, ...props }) => (
  <select className="occult-input" style={{ cursor: 'pointer', ...style }} {...props}>
    {children}
  </select>
)

export const PriBadge = ({ priority }) => {
  const cls = { High: 'pri-high', Medium: 'pri-medium', Low: 'pri-low' }[priority] || 'pri-low'
  return (
    <span
      className={cls}
      style={{ padding: '3px 10px', borderRadius: 2, fontSize: 10, flexShrink: 0, fontFamily: "'Cinzel',serif", letterSpacing: '1px' }}
    >{priority}</span>
  )
}

export const SectionTitle = ({ children }) => (
  <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10, color: '#8b0000', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
    {children}
  </div>
)
