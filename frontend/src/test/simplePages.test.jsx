import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound.jsx';
import NotAuthorized from '../pages/NotAuthorized.jsx';
import { useAuth } from '../auth/useAuth.js';

// Mock de useAuth
vi.mock('../auth/useAuth.js', () => ({
  useAuth: vi.fn(),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Simple Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('NotFound', () => {
    it('renderiza la página 404 correctamente', () => {
      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ir al inicio/ })).toBeInTheDocument();
    });
  });

  describe('NotAuthorized', () => {
    it('renderiza con rol ADMIN y redirige al panel correspondiente', () => {
      const mockLogout = vi.fn();
      useAuth.mockReturnValue({ role: 'ADMIN', logout: mockLogout });

      render(<NotAuthorized />);

      expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument();
      expect(screen.getByText(/Rol actual:/)).toBeInTheDocument();
      expect(screen.getByText('Administrador')).toBeInTheDocument();

      const homeBtn = screen.getByRole('button', { name: /Ir a mi portal/ });
      fireEvent.click(homeBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });

      const backBtn = screen.getByRole('button', { name: /Volver/ });
      fireEvent.click(backBtn);
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      const logoutBtn = screen.getByRole('button', { name: /Cerrar sesión/ });
      fireEvent.click(logoutBtn);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('renderiza con rol ORGANIZACION y redirige al panel correspondiente', () => {
      useAuth.mockReturnValue({ role: 'ORGANIZACION', logout: vi.fn() });

      render(<NotAuthorized />);

      expect(screen.getByText('Organización')).toBeInTheDocument();
      const homeBtn = screen.getByRole('button', { name: /Ir a mi portal/ });
      fireEvent.click(homeBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/organizacion', { replace: true });
    });

    it('renderiza con rol desconocido y redirige a bienvenida', () => {
      useAuth.mockReturnValue({ role: 'DESCONOCIDO', logout: vi.fn() });

      render(<NotAuthorized />);

      const homeBtn = screen.getByRole('button', { name: /Ir a mi portal/ });
      fireEvent.click(homeBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/bienvenida', { replace: true });
    });
  });
});
