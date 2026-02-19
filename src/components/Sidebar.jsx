import { EyeIcon, PentagramBg } from './ui'

const NAV = [
  { id: 'dashboard',  icon: '⬡', label: 'Sanctum'    },
  { id: 'tasks',      icon: '☽', label: 'Edicts'      },
  { id: 'categories', icon: '⛧', label: 'Covens'      },
  { id: 'account',    icon: '◈', label: 'Identity'    },
  { id: 'password',   icon: '⚿', label: 'Secret Key' },
]

export default function Sidebar({ page, setPage, onLogout, user }) {
  const initial = user?.firstName?.[0]?.toUpperCase() || 'A'
  const name    = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Acolyte'

  return (
    <div className="glass-sidebar" style={{ width: 210, display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <PentagramBg />

      {/* Logo */}
      <div style={{ padding: '0 20px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <EyeIcon size={24} />
        <span
          className="animate-flicker"
          style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 20, color: '#f0e8e8', letterSpacing: '2px' }}
        >
          ORD<span style={{ color: '#c0000c' }}>O</span>
        </span>
      </div>

      {/* User chip */}
      <div style={{ margin: '0 12px 20px', padding: '10px 12px', background: 'rgba(192,0,12,0.05)', border: '1px solid rgba(139,0,0,0.18)', borderRadius: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="animate-glow-pulse"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(192,0,12,0.12)', border: '1px solid #8b0000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cinzel',serif", fontWeight: 700, color: '#ff2222', fontSize: 13, flexShrink: 0,
            }}
          >{initial}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: '#f0e8e8', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#555' }}>Initiated Member</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1 }}>
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            style={{ color: page === n.id ? '#ff2222' : '#555' }}
            onClick={() => setPage(n.id)}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{n.icon}</span>
            {n.label}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div
        className="nav-item"
        style={{ color: '#444', borderTop: '1px solid rgba(139,0,0,0.12)' }}
        onClick={onLogout}
      >
        <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>⏻</span>
        Depart
      </div>
    </div>
  )
}
