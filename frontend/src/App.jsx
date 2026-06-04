import { useEffect } from 'react';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import { ToastProvider } from './shared/components/Toast.jsx';
import CursorAndMagneticEffects from './shared/components/CursorAndMagneticEffects.jsx';

function GlobalEffects() {
  useEffect(() => {
    // ── Scroll reveal ──
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    const attach = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    // ── Ripple on .ripple-btn ──
    const handleRipple = (e) => {
      const btn = e.target.closest('.ripple-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
      btn.classList.remove('ripple-btn');
      void btn.offsetWidth; // reflow
      btn.classList.add('ripple-btn');
    };
    document.addEventListener('click', handleRipple);

    return () => {
      observer.disconnect();
      mo.disconnect();
      document.removeEventListener('click', handleRipple);
    };
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalEffects />
        <CursorAndMagneticEffects />
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}


