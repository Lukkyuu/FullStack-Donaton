import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mocks globales
vi.mock('../auth/useAuth.js', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Juan Prueba', email: 'test@donaton.cl', rol: 'ADMIN' },
    role: 'ADMIN',
    logout: vi.fn(),
  }),
}));

vi.mock('../shared/hooks/useApi.js', () => ({
  useApi: () => ({
    data: {
      content: [],
      stats: { totalDonado: 1000, donantesActivos: 5, entregasExitosas: 98, solicitudesPendientes: 2 },
      preferencias: { email: true, push: false, sms: false },
    },
    loading: false,
    error: null,
    execute: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Imports de páginas a probar
import { ToastProvider } from '../shared/components/Toast.jsx';

// Admin
import AdminDashboard from '../portals/admin/pages/Dashboard.jsx';
import AdminDashboardOrganizacion from '../portals/admin/pages/DashboardOrganizacion.jsx';
import DetalleMatching from '../portals/admin/pages/DetalleMatching.jsx';
import DonacionesAdmin from '../portals/admin/pages/DonacionesAdmin.jsx';
import GestionLogistica from '../portals/admin/pages/GestionLogistica.jsx';
import MatchingPanel from '../portals/admin/pages/MatchingPanel.jsx';
import NecesidadesAdmin from '../portals/admin/pages/NecesidadesAdmin.jsx';
import Organizaciones from '../portals/admin/pages/Organizaciones.jsx';
import PreferenciasNotificacionesAdmin from '../portals/admin/pages/PreferenciasNotificacionesAdmin.jsx';

// Donante
import Campanas from '../portals/donante/pages/Campanas.jsx';
import DonanteDashboard from '../portals/donante/pages/Dashboard.jsx';
import DetalleDonacion from '../portals/donante/pages/DetalleDonacion.jsx';
import Impacto from '../portals/donante/pages/Impacto.jsx';
import MisDonaciones from '../portals/donante/pages/MisDonaciones.jsx';
import NecesidadesPublicas from '../portals/donante/pages/NecesidadesPublicas.jsx';
import NuevaDonacion from '../portals/donante/pages/NuevaDonacion.jsx';
import Perfil from '../portals/donante/pages/Perfil.jsx';
import PreferenciasNotificaciones from '../portals/donante/pages/PreferenciasNotificaciones.jsx';

// Organizacion
import OrgDashboardOrganizacion from '../portals/organizacion/pages/DashboardOrganizacion.jsx';
import PerfilOrganizacion from '../portals/organizacion/pages/PerfilOrganizacion.jsx';

describe('Portal Sub-Pages Rendering', () => {
  const renderInContext = (ui) => render(
    <ToastProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ToastProvider>
  );

  describe('Admin Portal Pages', () => {
    it('renderiza AdminDashboard', () => {
      renderInContext(<AdminDashboard />);
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });

    it('renderiza AdminDashboardOrganizacion', () => {
      renderInContext(<AdminDashboardOrganizacion />);
      expect(screen.getAllByText(/Necesidades/i).length).toBeGreaterThan(0);
    });

    it('renderiza DetalleMatching', () => {
      renderInContext(<DetalleMatching />);
      expect(screen.getByText(/Detalle de matching/i)).toBeInTheDocument();
    });

    it('renderiza DonacionesAdmin', () => {
      renderInContext(<DonacionesAdmin />);
      expect(screen.getByText(/Registro de Donaciones/i)).toBeInTheDocument();
    });

    it('renderiza GestionLogistica', () => {
      renderInContext(<GestionLogistica />);
      expect(screen.getByText(/Gestión de logística/i)).toBeInTheDocument();
    });

    it('renderiza MatchingPanel', () => {
      renderInContext(<MatchingPanel />);
      expect(screen.getAllByText(/matching/i).length).toBeGreaterThan(0);
    });

    it('renderiza NecesidadesAdmin', () => {
      renderInContext(<NecesidadesAdmin />);
      expect(screen.getByText(/Gestión de Necesidades/i)).toBeInTheDocument();
    });

    it('renderiza Organizaciones', () => {
      renderInContext(<Organizaciones />);
      expect(screen.getByText(/Organizaciones y usuarios/i)).toBeInTheDocument();
    });

    it('renderiza PreferenciasNotificacionesAdmin', () => {
      renderInContext(<PreferenciasNotificacionesAdmin />);
      expect(screen.getByText(/Preferencias de Notificaciones/i)).toBeInTheDocument();
    });
  });

  describe('Donante Portal Pages', () => {
    it('renderiza Campanas', () => {
      renderInContext(<Campanas />);
      expect(screen.getAllByText(/campañas/i).length).toBeGreaterThan(0);
    });

    it('renderiza DonanteDashboard', () => {
      renderInContext(<DonanteDashboard />);
      expect(screen.getByText(/Campañas en curso/i)).toBeInTheDocument();
    });

    it('renderiza DetalleDonacion', () => {
      renderInContext(<DetalleDonacion />);
      expect(screen.getByText(/Entregada/i)).toBeInTheDocument();
    });

    it('renderiza Impacto', () => {
      renderInContext(<Impacto />);
      expect(screen.getByText(/Mi impacto/i)).toBeInTheDocument();
    });

    it('renderiza MisDonaciones', () => {
      renderInContext(<MisDonaciones />);
      expect(screen.getByText(/Mis Donaciones/i)).toBeInTheDocument();
    });

    it('renderiza NecesidadesPublicas', () => {
      renderInContext(<NecesidadesPublicas />);
      expect(screen.getByText(/No hay necesidades/i)).toBeInTheDocument();
    });

    it('renderiza NuevaDonacion', () => {
      renderInContext(<NuevaDonacion />);
      expect(screen.getByText(/Tu ayuda es directa/i)).toBeInTheDocument();
    });

    it('renderiza Perfil', () => {
      renderInContext(<Perfil />);
      expect(screen.getByText(/Información personal/i)).toBeInTheDocument();
    });

    it('renderiza PreferenciasNotificaciones', () => {
      renderInContext(<PreferenciasNotificaciones />);
      expect(screen.getByText(/Preferencias de Notificaciones/i)).toBeInTheDocument();
    });
  });

  describe('Organizacion Portal Pages', () => {
    it('renderiza OrgDashboardOrganizacion', () => {
      renderInContext(<OrgDashboardOrganizacion />);
      expect(screen.getByText(/Mis necesidades/i)).toBeInTheDocument();
    });

    it('renderiza PerfilOrganizacion', () => {
      renderInContext(<PerfilOrganizacion />);
      expect(screen.getByText(/Representante/i)).toBeInTheDocument();
    });
  });
});
