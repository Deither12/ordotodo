import { Card, PriBadge, SectionTitle } from './ui'

export default function Dashboard({ tasks, categories, onView, onNavigate }) {
  const done      = tasks.filter(t => t.done).length
  const total     = tasks.length
  const pct       = total === 0 ? 0 : Math.round((done / total) * 100)
  const r         = 38
  const circ      = 2 * Math.PI * r
  const highCount = tasks.filter(t => t.priority === 'High' && !t.done).length

  // Tasks due today or past due (not done)
  const urgentTasks = tasks.filter(t => !t.done).slice(0, 5)

  return (
    <div className="animate-fade-in">
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Edicts',   val: total,        icon: '◈', col: '#8b0000' },
          { label: 'Fulfilled',      val: done,          icon: '✦', col: '#6b0000' },
          { label: 'Pending',        val: total - done,  icon: '☽', col: '#7a0000' },
          { label: 'High Severity',  val: highCount,     icon: '⚠', col: '#c0000c' },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 4, background: 'rgba(192,0,12,0.08)', border: '1px solid rgba(192,0,12,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: s.col, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Cinzel',serif", color: '#ff2222', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#555', fontFamily: "'Cinzel',serif", letterSpacing: '1px', textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Progress ring */}
        <Card>
          <SectionTitle>Grand Progress</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r={r} fill="none" stroke="#181818" strokeWidth="11" />
                <circle
                  cx="46" cy="46" r={r} fill="none" stroke="#c0000c" strokeWidth="11"
                  strokeDasharray={`${circ * pct / 100} ${circ}`}
                  strokeLinecap="round" transform="rotate(-90 46 46)"
                  style={{ filter: 'drop-shadow(0 0 6px #c0000c)', transition: 'stroke-dasharray 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 18, color: '#ff2222' }}>
                {pct}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>{done} of {total} fulfilled</div>
              <div style={{ height: 5, background: '#181818', borderRadius: 2, overflow: 'hidden', border: '1px solid #222', marginBottom: 8 }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right,#8b0000,#ff2222)', width: `${pct}%`, boxShadow: '0 0 8px #c0000c', transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['High', 'Medium', 'Low'].map(p => {
                  const cnt = tasks.filter(t => t.priority === p).length
                  const doneCnt = tasks.filter(t => t.priority === p && t.done).length
                  const pctP = cnt === 0 ? 0 : Math.round((doneCnt / cnt) * 100)
                  const col = { High: '#ff2222', Medium: '#cc4400', Low: '#882200' }[p]
                  return (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: col, fontFamily: "'Cinzel',serif", width: 50, letterSpacing: '1px' }}>{p}</span>
                      <div style={{ flex: 1, height: 3, background: '#181818', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: col, width: `${pctP}%`, transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#444', width: 28, textAlign: 'right' }}>{doneCnt}/{cnt}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Covens breakdown */}
        <Card>
          <SectionTitle>Covens</SectionTitle>
          {categories.map(c => {
            const total = tasks.filter(t => t.category === c.name).length
            const done  = tasks.filter(t => t.category === c.name && t.done).length
            const pct   = total === 0 ? 0 : Math.round((done / total) * 100)
            return (
              <div key={c.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, background: '#8b0000', transform: 'rotate(45deg)', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#c8b8b8', fontFamily: "'Crimson Text',serif" }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#555', fontFamily: "'Cinzel',serif" }}>{done}/{total}</span>
                </div>
                <div style={{ height: 3, background: '#181818', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(to right,#8b0000,#c0000c)', width: `${pct}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            )
          })}
        </Card>
      </div>

      {/* Imminent tasks */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle>Imminent Edicts</SectionTitle>
          <span
            onClick={() => onNavigate('tasks')}
            style={{ color: '#ff2222', fontSize: 11, cursor: 'pointer', fontFamily: "'Cinzel',serif", letterSpacing: '1px' }}
          >VIEW ALL →</span>
        </div>
        {urgentTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#333', fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '2px' }}>
            ALL EDICTS FULFILLED
          </div>
        ) : urgentTasks.map(t => (
          <div
            key={t.id}
            className="task-card"
            onClick={() => onView(t)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 6, cursor: 'pointer' }}
          >
            <div style={{ width: 14, height: 14, border: '1px solid #8b0000', transform: 'rotate(45deg)', flexShrink: 0, background: 'rgba(192,0,12,0.04)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, color: '#f0e8e8', fontFamily: "'Crimson Text',serif", fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{t.category} · Due {t.due}</div>
            </div>
            <PriBadge priority={t.priority} />
          </div>
        ))}
      </Card>
    </div>
  )
}
