import { createContext, useContext, useState, useCallback, useRef } from 'react';

/* ── Toast context ─────────────────────────────── */
const ToastContext = createContext(null);

let _idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, leaving: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 320);
    clearTimeout(timers.current[id]);
  }, []);

  const toast = useCallback((message, { type = 'success', duration = 3500 } = {}) => {
    const id = ++_idCounter;
    setToasts(t => [...t, { id, message, type, leaving: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const COLORS = {
    success: { bg: '#E1F5EE', border: '#B2E5D4', color: '#085041' },
    error:   { bg: '#FCEBEB', border: '#F7C1C1', color: '#A32D2D' },
    warning: { bg: '#FAEEDA', border: '#FAC775', color: '#854F0B' },
    info:    { bg: '#E6F1FB', border: '#B3D4F5', color: '#185FA5' },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type] ?? COLORS.info;
          return (
            <div
              key={t.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: c.bg, border: `1px solid ${c.border}`,
                color: c.color, borderRadius: 12, padding: '12px 16px',
                fontSize: 14, fontWeight: 500, minWidth: 260, maxWidth: 380,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                pointerEvents: 'all', cursor: 'pointer',
                animation: t.leaving ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease',
              }}
              onClick={() => dismiss(t.id)}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[t.type]}</span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
              <span style={{ fontSize: 16, opacity: 0.5, flexShrink: 0 }}>✕</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx.toast;
}
