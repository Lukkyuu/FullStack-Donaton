import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '../router/AppRouter.jsx';

// Mock BrowserRouter to act as a pass-through
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <>{children}</>,
  };
});

// Mock pages to render simple placeholders
vi.mock('../pages/Login.jsx', () => ({ default: () => <div data-testid="login-page">Login</div> }));
vi.mock('../pages/Register.jsx', () => ({ default: () => <div data-testid="register-page">Register</div> }));
vi.mock('../pages/Landing.jsx', () => ({ default: () => <div data-testid="landing-page">Landing</div> }));
vi.mock('../pages/NotAuthorized.jsx', () => ({ default: () => <div data-testid="not-auth-page">NotAuth</div> }));
vi.mock('../pages/NotFound.jsx', () => ({ default: () => <div data-testid="not-found-page">NotFound</div> }));
vi.mock('../pages/OlvidePassword.jsx', () => ({ default: () => <div data-testid="forgot-page">Forgot</div> }));
vi.mock('../pages/ResetPassword.jsx', () => ({ default: () => <div data-testid="reset-page">Reset</div> }));

// Mock ProtectedRoute to render its children directly
vi.mock('../auth/ProtectedRoute.jsx', () => ({
  default: () => <div data-testid="protected">Protected Layout</div>
}));

describe('AppRouter Routing', () => {
  it('renders Landing page on /bienvenida', () => {
    render(
      <MemoryRouter initialEntries={['/bienvenida']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders Login page on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders Register page on /registro', () => {
    render(
      <MemoryRouter initialEntries={['/registro']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  it('renders NotFound on wildcard route', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
