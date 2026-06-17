import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del apiClient
vi.mock('../api/axiosClient.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

import apiClient from '../api/axiosClient.js';
import { authService } from '../api/services/authService.js';
import { donacionesService } from '../api/services/donacionesService.js';
import { logisticaService } from '../api/services/logisticaService.js';
import { matchingService } from '../api/services/matchingService.js';
import { necesidadesService } from '../api/services/necesidadesService.js';
import { notificacionesService } from '../api/services/notificacionesService.js';
import { usuariosService } from '../api/services/usuariosService.js';

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authService', () => {
    it('login llama a /api/auth/login con POST', async () => {
      await authService.login('email', 'pass');
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', { email: 'email', password: 'pass' });
    });

    it('logout llama a /api/auth/logout con POST', async () => {
      await authService.logout();
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout');
    });

    it('refresh llama a /api/auth/refresh con POST', async () => {
      await authService.refresh();
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/refresh');
    });

    it('me llama a /api/auth/me con GET', async () => {
      await authService.me();
      expect(apiClient.get).toHaveBeenCalledWith('/api/auth/me');
    });
  });

  describe('donacionesService', () => {
    it('listar llama a GET /api/donaciones', async () => {
      const params = { page: 1 };
      await donacionesService.listar(params);
      expect(apiClient.get).toHaveBeenCalledWith('/api/donaciones', { params });
    });

    it('listarMias llama a GET /api/donaciones/mis-donaciones', async () => {
      const params = { page: 1 };
      await donacionesService.listarMias(params);
      expect(apiClient.get).toHaveBeenCalledWith('/api/donaciones/mis-donaciones', { params });
    });

    it('obtener llama a GET /api/donaciones/:id', async () => {
      await donacionesService.obtener(5);
      expect(apiClient.get).toHaveBeenCalledWith('/api/donaciones/5');
    });

    it('crear llama a POST /api/donaciones', async () => {
      const data = { monto: 100 };
      await donacionesService.crear(data);
      expect(apiClient.post).toHaveBeenCalledWith('/api/donaciones', data);
    });

    it('actualizar llama a PUT /api/donaciones/:id', async () => {
      const data = { monto: 200 };
      await donacionesService.actualizar(5, data);
      expect(apiClient.put).toHaveBeenCalledWith('/api/donaciones/5', data);
    });

    it('cancelar llama a PATCH /api/donaciones/:id/cancelar', async () => {
      await donacionesService.cancelar(5);
      expect(apiClient.patch).toHaveBeenCalledWith('/api/donaciones/5/cancelar');
    });

    it('listarCampanas llama a GET /api/donaciones/campanas', async () => {
      const params = { search: 'test' };
      await donacionesService.listarCampanas(params);
      expect(apiClient.get).toHaveBeenCalledWith('/api/donaciones/campanas', { params });
    });

    it('obtenerCampana llama a GET /api/donaciones/campanas/:id', async () => {
      await donacionesService.obtenerCampana(5);
      expect(apiClient.get).toHaveBeenCalledWith('/api/donaciones/campanas/5');
    });
  });

  describe('logisticaService', () => {
    it('listarRecursos llama a GET', async () => {
      await logisticaService.listarRecursos({ limit: 10 });
      expect(apiClient.get).toHaveBeenCalledWith('/api/logistica/recursos', { params: { limit: 10 } });
    });

    it('obtenerRecurso llama a GET', async () => {
      await logisticaService.obtenerRecurso(2);
      expect(apiClient.get).toHaveBeenCalledWith('/api/logistica/recursos/2');
    });

    it('crearRecurso llama a POST', async () => {
      await logisticaService.crearRecurso({ nombre: 'x' });
      expect(apiClient.post).toHaveBeenCalledWith('/api/logistica/recursos', { nombre: 'x' });
    });

    it('listarDistribuciones llama a GET', async () => {
      await logisticaService.listarDistribuciones({ page: 2 });
      expect(apiClient.get).toHaveBeenCalledWith('/api/logistica/distribuciones', { params: { page: 2 } });
    });

    it('crearDistribucion llama a POST', async () => {
      await logisticaService.crearDistribucion({ dist: 'y' });
      expect(apiClient.post).toHaveBeenCalledWith('/api/logistica/distribuciones', { dist: 'y' });
    });

    it('obtenerDistribucion llama a GET', async () => {
      await logisticaService.obtenerDistribucion(3);
      expect(apiClient.get).toHaveBeenCalledWith('/api/logistica/distribuciones/3');
    });
  });

  describe('matchingService', () => {
    it('listarResultados llama a GET', async () => {
      await matchingService.listarResultados({ page: 1 });
      expect(apiClient.get).toHaveBeenCalledWith('/api/matching/resultados', { params: { page: 1 } });
    });

    it('obtenerResultado llama a GET', async () => {
      await matchingService.obtenerResultado(1);
      expect(apiClient.get).toHaveBeenCalledWith('/api/matching/resultados/1');
    });
  });

  describe('necesidadesService', () => {
    it('listar llama a GET', async () => {
      await necesidadesService.listar({ state: 'open' });
      expect(apiClient.get).toHaveBeenCalledWith('/api/necesidades', { params: { state: 'open' } });
    });

    it('listarMias llama a GET', async () => {
      await necesidadesService.listarMias({ page: 1 });
      expect(apiClient.get).toHaveBeenCalledWith('/api/necesidades/mis-necesidades', { params: { page: 1 } });
    });

    it('probarConexiones llama a GET', async () => {
      await necesidadesService.probarConexiones();
      expect(apiClient.get).toHaveBeenCalledWith('/api/necesidades/health/db');
    });

    it('publicas llama a GET', async () => {
      await necesidadesService.publicas({ search: 'comida' });
      expect(apiClient.get).toHaveBeenCalledWith('/api/necesidades/publicas', { params: { search: 'comida' } });
    });

    it('obtener llama a GET', async () => {
      await necesidadesService.obtener(4);
      expect(apiClient.get).toHaveBeenCalledWith('/api/necesidades/4');
    });

    it('crear llama a POST', async () => {
      await necesidadesService.crear({ title: 'need' });
      expect(apiClient.post).toHaveBeenCalledWith('/api/necesidades', { title: 'need' });
    });

    it('actualizar llama a PUT', async () => {
      await necesidadesService.actualizar(4, { title: 'need2' });
      expect(apiClient.put).toHaveBeenCalledWith('/api/necesidades/4', { title: 'need2' });
    });

    it('cerrar llama a PATCH', async () => {
      await necesidadesService.cerrar(4);
      expect(apiClient.patch).toHaveBeenCalledWith('/api/necesidades/4/cerrar');
    });
  });

  describe('notificacionesService', () => {
    it('getPreferencias llama a GET', async () => {
      await notificacionesService.getPreferencias();
      expect(apiClient.get).toHaveBeenCalledWith('/api/notificaciones/preferencias');
    });

    it('updatePreferencias llama a PUT', async () => {
      await notificacionesService.updatePreferencias({ email: true });
      expect(apiClient.put).toHaveBeenCalledWith('/api/notificaciones/preferencias', { email: true });
    });
  });

  describe('usuariosService', () => {
    it('listar llama a GET', async () => {
      await usuariosService.listar({ role: 'admin' });
      expect(apiClient.get).toHaveBeenCalledWith('/usuarios', { params: { role: 'admin' } });
    });

    it('obtener llama a GET', async () => {
      await usuariosService.obtener(7);
      expect(apiClient.get).toHaveBeenCalledWith('/usuarios/7');
    });

    it('crear llama a POST', async () => {
      await usuariosService.crear({ name: 'user' });
      expect(apiClient.post).toHaveBeenCalledWith('/usuarios', { name: 'user' });
    });

    it('actualizar llama a PUT', async () => {
      await usuariosService.actualizar(7, { name: 'user2' });
      expect(apiClient.put).toHaveBeenCalledWith('/usuarios/7', { name: 'user2' });
    });

    it('eliminar llama a DELETE', async () => {
      await usuariosService.eliminar(7);
      expect(apiClient.delete).toHaveBeenCalledWith('/usuarios/7');
    });

    it('perfil llama a GET', async () => {
      await usuariosService.perfil();
      expect(apiClient.get).toHaveBeenCalledWith('/usuarios/perfil');
    });
  });
});
