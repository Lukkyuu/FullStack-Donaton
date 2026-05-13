import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

// Páginas públicas
import Login          from '../pages/Login.jsx';
import Register       from '../pages/Register.jsx';
import Landing        from '../pages/Landing.jsx';
import NotAuthorized  from '../pages/NotAuthorized.jsx';

// Portal Donante
import DonantePage               from '../portals/donante/DonantePage.jsx';
import DonanteHome               from '../portals/donante/pages/Dashboard.jsx';
import MisDonaciones             from '../portals/donante/pages/MisDonaciones.jsx';
import DetalleDonacion           from '../portals/donante/pages/DetalleDonacion.jsx';
import NecesidadesPublicas       from '../portals/donante/pages/NecesidadesPublicas.jsx';
import NuevaDonacion             from '../portals/donante/pages/NuevaDonacion.jsx';
import Campanas                  from '../portals/donante/pages/Campanas.jsx';
import Perfil                    from '../portals/donante/pages/Perfil.jsx';
import PreferenciasNotificaciones from '../portals/donante/pages/PreferenciasNotificaciones.jsx';

// Portal Admin (ADMIN)
import AdminPage               from '../portals/admin/AdminPage.jsx';
import AdminHome               from '../portals/admin/pages/Dashboard.jsx';
import GestionLogistica        from '../portals/admin/pages/GestionLogistica.jsx';
import MatchingPanel           from '../portals/admin/pages/MatchingPanel.jsx';
import DetalleMatching         from '../portals/admin/pages/DetalleMatching.jsx';
import Organizaciones          from '../portals/admin/pages/Organizaciones.jsx';
import NecesidadesAdmin        from '../portals/admin/pages/NecesidadesAdmin.jsx';
import PreferenciasNotifAdmin  from '../portals/admin/pages/PreferenciasNotificacionesAdmin.jsx';

// Portal Organización
import DashboardOrganizacion   from '../portals/admin/pages/DashboardOrganizacion.jsx';

export const ROLES = {
  ADMIN:        'ADMIN',
  ORGANIZACION: 'ORGANIZACION',
  DONANTE:      'DONANTE',
  ANONIMO:      'ANONIMO',
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas raíz: redirige según autenticación — el componente Landing maneja ANONIMO */}
        <Route path="/" element={<Navigate to="/donante" replace />} />

        {/* Rutas públicas */}
        <Route path="/login"        element={<Login />} />
        <Route path="/registro"     element={<Register />} />
        <Route path="/bienvenida"   element={<Landing />} />
        <Route path="/no-autorizado" element={<NotAuthorized />} />

        {/* ── Portal Donante: DONANTE autenticado ── */}
        <Route
          path="/donante"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.DONANTE]}
              redirectTo="/bienvenida"
            />
          }
        >
          <Route element={<DonantePage />}>
            <Route index                              element={<DonanteHome />} />
            <Route path="mis-donaciones"             element={<MisDonaciones />} />
            <Route path="mis-donaciones/:id"         element={<DetalleDonacion />} />
            <Route path="necesidades"                element={<NecesidadesPublicas />} />
            <Route path="campanas"                   element={<Campanas />} />
            <Route path="nueva-donacion"             element={<NuevaDonacion />} />
            <Route path="perfil"                     element={<Perfil />} />
            <Route path="notificaciones"             element={<PreferenciasNotificaciones />} />
          </Route>
        </Route>

        {/* ── Portal Admin: solo ADMIN ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN]}
              redirectTo="/no-autorizado"
            />
          }
        >
          <Route element={<AdminPage />}>
            <Route index                    element={<AdminHome />} />
            <Route path="logistica"         element={<GestionLogistica />} />
            <Route path="matching"          element={<MatchingPanel />} />
            <Route path="matching/:id"      element={<DetalleMatching />} />
            <Route path="organizaciones"    element={<Organizaciones />} />
            <Route path="necesidades"       element={<NecesidadesAdmin />} />
            <Route path="notificaciones"    element={<PreferenciasNotifAdmin />} />
          </Route>
        </Route>

        {/* ── Portal Organización: solo ORGANIZACION ── */}
        <Route
          path="/organizacion"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ORGANIZACION]}
              redirectTo="/no-autorizado"
            />
          }
        >
          <Route element={<AdminPage />}>
            <Route index                    element={<DashboardOrganizacion />} />
            <Route path="necesidades"       element={<NecesidadesAdmin />} />
            <Route path="matching"          element={<MatchingPanel />} />
            <Route path="matching/:id"      element={<DetalleMatching />} />
            <Route path="notificaciones"    element={<PreferenciasNotifAdmin />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
