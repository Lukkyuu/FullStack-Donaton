/**
 * ProtectedRoute.test.jsx
 * Prueba unitaria: verifica el comportamiento del Guard de rutas.
 * Patrón: Proxy/Guard — control de acceso centralizado.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

// Mock del hook useAuth
vi.mock('../auth/useAuth.js', () => ({
  useAuth: vi.fn(),
}));

// Mock del LoadingSpinner
vi.mock('../shared/components/LoadingSpinner.jsx', () => ({
  default: () => <div data-testid="spinner">Cargando...</div>,
}));

import { useAuth } from '../auth/useAuth.js';

function renderWithRouter(allowedRoles, role, isLoading = false) {
  useAuth.mockReturnValue({ role, isLoading });

  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <Routes>
        <Route
          element={<ProtectedRoute allowedRoles={allowedRoles} redirectTo="/no-autorizado" />}
        >
          <Route path="/protegida" element={<div>Contenido protegido</div>} />
        </Route>
        <Route path="/no-autorizado" element={<div>No autorizado</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute (Patrón Proxy/Guard)', () => {
  it('muestra spinner mientras carga', () => {
    renderWithRouter(['ADMIN'], null, true);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('permite el acceso cuando el rol es válido', () => {
    renderWithRouter(['ADMIN', 'ORGANIZACION'], 'ADMIN');
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('redirige cuando el rol no está permitido', () => {
    renderWithRouter(['ADMIN'], 'DONANTE');
    expect(screen.getByText('No autorizado')).toBeInTheDocument();
  });

  it('redirige cuando no hay sesión (role null)', () => {
    renderWithRouter(['ADMIN'], null);
    expect(screen.getByText('No autorizado')).toBeInTheDocument();
  });

  it('permite ORGANIZACION cuando está en la lista', () => {
    renderWithRouter(['ADMIN', 'ORGANIZACION'], 'ORGANIZACION');
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('rechaza DONANTE en portal de admin', () => {
    renderWithRouter(['ADMIN', 'ORGANIZACION'], 'DONANTE');
    expect(screen.getByText('No autorizado')).toBeInTheDocument();
  });
});
