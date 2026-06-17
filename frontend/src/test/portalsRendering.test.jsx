import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../portals/admin/AdminPage.jsx';
import DonantePage from '../portals/donante/DonantePage.jsx';
import OrganizacionPage from '../portals/organizacion/OrganizacionPage.jsx';

// Mock de useAuth
vi.mock('../auth/useAuth.js', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    role: 'ADMIN',
    user: { nombre: 'Juan Administrador' },
  }),
}));

describe('Portals Rendering', () => {
  it('renderiza AdminPage layout sin explotar', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Panel Administrador')).toBeInTheDocument();
    expect(screen.getAllByText('Juan Administrador').length).toBeGreaterThan(0);
  });

  it('renderiza DonantePage layout sin explotar', () => {
    render(
      <MemoryRouter>
        <DonantePage />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Portal Donante').length).toBeGreaterThan(0);
  });

  it('renderiza OrganizacionPage layout sin explotar', () => {
    render(
      <MemoryRouter>
        <OrganizacionPage />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Portal Organización').length).toBeGreaterThan(0);
  });
});
