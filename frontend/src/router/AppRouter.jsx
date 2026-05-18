import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

// Páginas públicas
import Login          from '../pages/Login.jsx';
import Register       from '../pages/Register.jsx';
import Landing        from '../pages/Landing.jsx';
import NotAuthorized  from '../pages/NotAuthorized.jsx';
import NotFound       from '../pages/NotFound.jsx';
import OlvidePassword from '../pages/OlvidePassword.jsx';
import ResetPassword  from '../pages/ResetPassword.jsx';

// Portal Donante
import DonantePage               from '../portals/donante/DonantePage.jsx';
import DonanteHome               from '../portals/donante/pages/Dashboard.jsx';
import MisDonaciones             from '../portals/donante/pages/MisDonaciones.jsx';
import DetalleDonacion           from '../portals/donante/pages/DetalleDonacion.jsx';
import NecesidadesPublicas       from '../portals/donante/pages/NecesidadesPublicas.jsx';
import NuevaDonacion             from '../portals/donante/pages/NuevaDonacion.jsx';
import Campanas                  from '../portals/donante/pages/Campanas.jsx';
import Perfil                    from '../portals/donante/pages/Perfil.jsx';
import Impacto                   from '../portals/donante/pages/Impacto.jsx';
import PreferenciasNotificaciones from '../portals/donante/pages/PreferenciasNotificaciones.jsx';

// Portal Admin
import AdminPage               from '../portals/admin/AdminPage.jsx';
import AdminHome               from '../portals/admin/pages/Dashboard.jsx';
import GestionLogistica        from '../portals/admin/pages/GestionLogistica.jsx';
import MatchingPanel           from '../portals/admin/pages/MatchingPanel.jsx';
import DetalleMatching         from '../portals/admin/pages/DetalleMatching.jsx';
import Organizaciones          from '../portals/admin/pages/Organizaciones.jsx';
import NecesidadesAdmin        from '../portals/admin/pages/NecesidadesAdmin.jsx';
import PreferenciasNotifAdmin  from '../portals/admin/pages/PreferenciasNotificacionesAdmin.jsx';
import DonacionesAdmin         from '../portals/admin/pages/DonacionesAdmin.jsx';

// Portal Organización
import OrganizacionPage        from '../portals/organizacion/OrganizacionPage.jsx';
import DashboardOrganizacion   from '../portals/organizacion/pages/DashboardOrganizacion.jsx';
import PerfilOrganizacion      from '../portals/organizacion/pages/PerfilOrganizacion.jsx';

export const ROLES = {
  ADMIN:        'ADMIN',
  ORGANIZACION: 'ORGANIZACION',
  DONANTE:      'DONANTE',
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz */}
        <Route path="/" element={<Navigate to="/bienvenida" replace />} />

        {/* Rutas públicas */}
        <Route path="/login"           element={<Login />} />
        <Route path="/registro"        element={<Register />} />
        <Route path="/bienvenida"      element={<Landing />} />
        <Route path="/no-autorizado"   element={<NotAuthorized />} />
        <Route path="/olvide-password" element={<OlvidePassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* ── Portal Donante ── */}
        <Route
          path="/donante"
          element={<ProtectedRoute allowedRoles={[ROLES.DONANTE]} redirectTo="/bienvenida" />}
        >
          <Route element={<DonantePage />}>
            <Route index                              element={<DonanteHome />} />
            <Route path="mis-donaciones"             element={<MisDonaciones />} />
            <Route path="mis-donaciones/:id"         element={<DetalleDonacion />} />
            <Route path="necesidades"                element={<NecesidadesPublicas />} />
            <Route path="campanas"                   element={<Campanas />} />
            <Route path="nueva-donacion"             element={<NuevaDonacion />} />
            <Route path="perfil"                     element={<Perfil />} />
            <Route path="impacto"                    element={<Impacto />} />
            <Route path="notificaciones"             element={<PreferenciasNotificaciones />} />
          </Route>
        </Route>

        {/* ── Portal Admin ── */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} redirectTo="/no-autorizado" />}
        >
          <Route element={<AdminPage />}>
            <Route index                    element={<AdminHome />} />
            <Route path="donaciones"        element={<DonacionesAdmin />} />
            <Route path="logistica"         element={<GestionLogistica />} />
            <Route path="matching"          element={<MatchingPanel />} />
            <Route path="matching/:id"      element={<DetalleMatching />} />
            <Route path="organizaciones"    element={<Organizaciones />} />
            <Route path="necesidades"       element={<NecesidadesAdmin />} />
            <Route path="notificaciones"    element={<PreferenciasNotifAdmin />} />
          </Route>
        </Route>

        {/* ── Portal Organización ── */}
        <Route
          path="/organizacion"
          element={<ProtectedRoute allowedRoles={[ROLES.ORGANIZACION]} redirectTo="/no-autorizado" />}
        >
          <Route element={<OrganizacionPage />}>
            <Route index                    element={<DashboardOrganizacion />} />
            <Route path="necesidades"       element={<NecesidadesAdmin />} />
            <Route path="matching"          element={<MatchingPanel />} />
            <Route path="matching/:id"      element={<DetalleMatching />} />
            <Route path="notificaciones"    element={<PreferenciasNotifAdmin />} />
            <Route path="perfil"            element={<PerfilOrganizacion />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
