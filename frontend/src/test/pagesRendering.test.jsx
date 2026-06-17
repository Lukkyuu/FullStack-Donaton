import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import OlvidePassword from '../pages/OlvidePassword.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import apiClient from '../api/axiosClient.js';

// Mock de useAuth
const mockLogin = vi.fn();
const mockRegister = vi.fn();
vi.mock('../auth/useAuth.js', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    logout: vi.fn(),
    role: 'DONANTE',
    user: { nombre: 'Juan' },
  }),
}));

// Mock de useApi
vi.mock('../shared/hooks/useApi.js', () => ({
  useApi: () => ({
    data: [],
    loading: false,
    error: null,
    execute: vi.fn(),
  }),
}));

describe('Pages Rendering', () => {
  it('renderiza Landing page sin explotar', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Donaton').length).toBeGreaterThan(0);
  });

  it('renderiza Login page sin explotar y soporta interacciones', async () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();

    const emailInput = container.querySelector('input[name="email"]');
    const passInput = container.querySelector('input[name="password"]');

    // Focus / Blur
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    fireEvent.focus(passInput);
    fireEvent.blur(passInput);

    // Change inputs
    fireEvent.change(emailInput, { target: { name: 'email', value: 'donante@donaton.cl' } });
    fireEvent.change(passInput, { target: { name: 'password', value: 'Donante123!' } });

    // Toggle password visibility
    const toggleBtn = container.querySelector('.auth-toggle-pwd');
    fireEvent.click(toggleBtn);
    expect(passInput.type).toBe('text');
    fireEvent.click(toggleBtn);
    expect(passInput.type).toBe('password');

    // Submit form
    mockLogin.mockResolvedValueOnce('DONANTE');
    const form = screen.getByRole('button', { name: /Ingresar/i });
    await act(async () => {
      fireEvent.click(form);
    });
  });

  it('renderiza Register page y soporta flujo interactivo de pasos', async () => {
    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText(/¿Cómo quieres participar\?/i)).toBeInTheDocument();

    // Select account type
    fireEvent.click(screen.getByText('Soy donante'));

    // Go to step 2
    fireEvent.click(screen.getByText('Continuar →'));

    // Now in step 2, check heading
    expect(screen.getByText('Soy donante')).toBeInTheDocument();

    // Fill in details via container querySelector
    const nameInput = container.querySelector('input[name="nombre"]');
    const rutInput = container.querySelector('input[name="rut"]');
    const birthInput = container.querySelector('input[name="fechaNacimiento"]');
    const emailInput = container.querySelector('input[name="email"]');
    const telInput = container.querySelector('input[name="telefono"]');
    const regionSelect = container.querySelector('select[name="region"]');
    const domInput = container.querySelector('input[name="domicilio"]');
    const passInput = container.querySelector('input[name="password"]');
    const confirmInput = container.querySelector('input[name="confirmPassword"]');

    fireEvent.change(nameInput, { target: { name: 'nombre', value: 'Juan Pérez' } });
    fireEvent.change(rutInput, { target: { name: 'rut', value: '19.999.999-9' } });
    fireEvent.change(birthInput, { target: { name: 'fechaNacimiento', value: '1995-05-15' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'juan@donaton.cl' } });
    fireEvent.change(telInput, { target: { name: 'telefono', value: '+56999999999' } });
    fireEvent.change(domInput, { target: { name: 'domicilio', value: 'Avenida Siempre Viva 742' } });

    // Region & City Selection
    fireEvent.change(regionSelect, { target: { name: 'region', value: 'Metropolitana de Santiago' } });
    const citySelect = container.querySelector('select[name="ciudad"]');
    fireEvent.change(citySelect, { target: { name: 'ciudad', value: 'Santiago' } });

    // Passwords
    fireEvent.change(passInput, { target: { name: 'password', value: 'Pass12345!' } });
    fireEvent.change(confirmInput, { target: { name: 'confirmPassword', value: 'Pass12345!' } });

    // Toggle password displays
    const toggleBtns = container.querySelectorAll('.auth-toggle-pwd');
    if (toggleBtns.length > 0) {
      fireEvent.click(toggleBtns[0]);
    }

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
  });

  it('soporta navegación de regreso en Register page', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Soy donante'));
    fireEvent.click(screen.getByText('Continuar →'));
    expect(screen.getByText('Soy donante')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Volver'));
    expect(screen.getByText(/¿Cómo quieres participar\?/i)).toBeInTheDocument();
  });

  it('renderiza OlvidePassword page sin explotar, soporta envío y cambio de estado', async () => {
    // Mock successful post
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <OlvidePassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/Olvidé mi contraseña/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'recuperar@donaton.cl' } });

    const submitBtn = screen.getByRole('button', { name: /Enviar enlace de recuperación/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Should show sent state
    expect(screen.getByText('¡Correo enviado!')).toBeInTheDocument();

    // Click "Intentar con otro correo" button
    const retryBtn = screen.getByRole('button', { name: /Intentar con otro correo/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(screen.getByText(/Olvidé mi contraseña/i)).toBeInTheDocument();
    postSpy.mockRestore();
  });

  it('OlvidePassword maneja error de llamada al backend', async () => {
    const postSpy = vi.spyOn(apiClient, 'post').mockRejectedValueOnce({
      response: { data: { message: 'El correo no existe' } }
    });

    render(
      <MemoryRouter>
        <OlvidePassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'bad@donaton.cl' } });

    const submitBtn = screen.getByRole('button', { name: /Enviar enlace de recuperación/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(await screen.findByText('El correo no existe')).toBeInTheDocument();
    postSpy.mockRestore();
  });

  it('renderiza ResetPassword page con token, valida campos y soporta cambio de clave', async () => {
    vi.useFakeTimers();
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/reset-password?token=mock_token_123']}>
        <ResetPassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/Restablecer Contraseña/i)).toBeInTheDocument();

    const passInput = screen.getByLabelText(/^Nueva contraseña$/i);
    const confirmInput = screen.getByLabelText(/^Confirmar nueva contraseña$/i);
    const submitBtn = screen.getByRole('button', { name: /Guardar y continuar/i });

    // Test mismatch validation
    fireEvent.change(passInput, { target: { name: 'password', value: 'NewPass123!' } });
    fireEvent.change(confirmInput, { target: { name: 'confirmPassword', value: 'Different!' } });
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();

    // Test length validation
    fireEvent.change(passInput, { target: { name: 'password', value: 'short' } });
    fireEvent.change(confirmInput, { target: { name: 'confirmPassword', value: 'short' } });
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();

    // Test successful submission
    fireEvent.change(passInput, { target: { name: 'password', value: 'ValidPass123!' } });
    fireEvent.change(confirmInput, { target: { name: 'confirmPassword', value: 'ValidPass123!' } });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(screen.getByText('¡Contraseña actualizada!')).toBeInTheDocument();

    // Fast-forward timers for redirect
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    vi.useRealTimers();
    postSpy.mockRestore();
  });
});
