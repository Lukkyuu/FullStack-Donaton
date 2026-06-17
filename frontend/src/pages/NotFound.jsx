import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.png';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#071d16 0%,#0f2d24 50%,#1a5240 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position:'fixed',top:-100,right:-80,width:400,height:400,borderRadius:'50%',background:'rgba(93,202,165,0.1)',filter:'blur(70px)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',bottom:-80,left:-60,width:300,height:300,borderRadius:'50%',background:'rgba(239,159,39,0.07)',filter:'blur(60px)',pointerEvents:'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <img src={logoUrl} alt="Donaton" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'var(--surface-container-lowest)', marginBottom: 24, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }} />

        {/* 404 */}
        <div style={{
          fontSize: 96, fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg,#5DCAA5,#fff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>404</div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          Página no encontrada
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36 }}>
          La ruta que buscas no existe o fue movida. Vuelve al inicio para continuar.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/bienvenida" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15, borderRadius: 12, textDecoration: 'none' }}>
            🏠 Ir al inicio
          </Link>
          <Link to="/login" className="btn" style={{ padding: '12px 28px', fontSize: 15, borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </div>

        <p style={{ marginTop: 40, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          Donaton · Plataforma de Donaciones Solidarias
        </p>
      </div>
    </div>
  );
}
