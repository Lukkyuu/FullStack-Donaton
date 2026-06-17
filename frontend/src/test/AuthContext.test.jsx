import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../auth/AuthContext.jsx';
import { useAuth } from '../auth/useAuth.js';
import apiClient from '../api/axiosClient.js';
import { demoLogin } from '../auth/demoUsers.js';

// Mock the API client
const mockPost = vi.fn();
vi.mock('../api/axiosClient.js', () => ({
  default: {
    post: (...args) => mockPost(...args),
  },
  bindAuthHelpers: vi.fn(),
}));

const TestComponent = () => {
  const { user, role, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user-name">{user ? user.nombre : 'No User'}</span>
      <span data-testid="user-role">{role ?? 'No Role'}</span>
      <button onClick={() => login('admin@donaton.cl', 'Admin123!').catch(() => {})}>Login Demo</button>
      <button onClick={() => login('invalid@donaton.cl', 'wrong').catch(err => { window.lastError = err; })}>Login Invalid</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext and useAuth', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
    mockPost.mockReset();
    
    // Mock window.location.replace
    delete window.location;
    window.location = { replace: vi.fn() };
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location = originalLocation;
  });

  it('throws an error if useAuth is used outside AuthProvider', () => {
    const BadComponent = () => {
      useAuth();
      return null;
    };
    // Suppress console.error output for expected error boundary test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadComponent />)).toThrow('useAuth debe usarse dentro de <AuthProvider>');
    spy.mockRestore();
  });

  it('shows splash screen initially and renders children after loading session', async () => {
    // Mock successful token refresh
    mockPost.mockResolvedValue({ data: { token: 'fake.eyJzdWIiOiIxIiwibm9tYnJlIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2wiLCJyb2xlIjoiRE9OQU5URSJ9.sig' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should show splash screen
    expect(screen.getByText('Cargando tu sesión…')).toBeInTheDocument();

    // Advance fake timers by 1200ms
    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve(); // flush microtasks
    });

    // Splash screen should disappear, user info should load
    expect(screen.queryByText('Cargando tu sesión…')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-name').textContent).toBe('Test User');
    expect(screen.getByTestId('user-role').textContent).toBe('DONANTE');
  });

  it('handles refresh failure gracefully', async () => {
    mockPost.mockRejectedValue(new Error('Refresh failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
    expect(screen.getByTestId('user-role').textContent).toBe('No Role');
  });

  it('supports logging in via backend API', async () => {
    mockPost.mockRejectedValueOnce(new Error('Refresh failed')); // refresh fails
    mockPost.mockResolvedValueOnce({ data: { token: 'fake.eyJzdWIiOiIyIiwibm9tYnJlIjoiQVBJIFVzZXIiLCJlbWFpbCI6ImFwaUB0ZXN0LmNsIiwicm9sZSI6IkFETUlOIn0.sig', rol: 'ADMIN' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    const loginBtn = screen.getByText('Login Demo');
    await act(async () => {
      loginBtn.click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('API User');
    expect(screen.getByTestId('user-role').textContent).toBe('ADMIN');
  });

  it('falls back to demo users when login API fails', async () => {
    mockPost.mockRejectedValue(new Error('API failure')); // both refresh and login fail

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    const loginBtn = screen.getByText('Login Demo');
    await act(async () => {
      loginBtn.click();
    });

    // Should load credentials from buildFakeJWT / demoUsers
    expect(screen.getByTestId('user-name').textContent).toBe('Admin Demo');
    expect(screen.getByTestId('user-role').textContent).toBe('ADMIN');
  });

  it('throws error when login API fails and no demo user matches', async () => {
    mockPost.mockRejectedValue(new Error('API failure'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    const loginInvalidBtn = screen.getByText('Login Invalid');
    window.lastError = undefined;

    await act(async () => {
      loginInvalidBtn.click();
    });
    
    expect(window.lastError).toBeDefined();
    expect(window.lastError.message).toBe('API failure');
    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });

  it('calls API and performs redirects on logout', async () => {
    // Mock refresh successful
    mockPost.mockResolvedValueOnce({ data: { token: 'fake.eyJzdWIiOiIxIiwibm9tYnJlIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2wiLCJyb2xlIjoiRE9OQU5URSJ9.sig' } });
    mockPost.mockResolvedValueOnce({}); // logout succeeds

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    const logoutBtn = screen.getByText('Logout');
    await act(async () => {
      logoutBtn.click();
    });

    expect(window.location.replace).toHaveBeenCalledWith('/login');
    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });

  it('tests buildFakeJWT and demoLogin directly', () => {
    const adminLogin = demoLogin('admin@donaton.cl', 'Admin123!');
    expect(adminLogin).not.toBeNull();
    expect(adminLogin.rol).toBe('ADMIN');
    expect(adminLogin.token).toBeDefined();

    const badLogin = demoLogin('nonexistent@donaton.cl', 'password');
    expect(badLogin).toBeNull();
  });
});
