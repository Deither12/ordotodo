import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const remove = id => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            style={{
              padding: '12px 18px',
              borderRadius: 4,
              fontFamily: "'Cinzel',serif",
              fontSize: 11,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              animation: 'fadeIn 0.3s ease',
              background: t.type === 'error' ? 'rgba(139,0,0,0.95)' : t.type === 'warn' ? 'rgba(100,40,0,0.95)' : 'rgba(20,20,20,0.97)',
              border: `1px solid ${t.type === 'error' ? '#c0000c' : t.type === 'warn' ? '#883300' : '#8b0000'}`,
              color: '#f0e8e8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
              minWidth: 260,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 14 }}>
              {t.type === 'error' ? '✕' : t.type === 'warn' ? '⚠' : '✦'}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
