/**
 * endpoints.test.js
 * Prueba unitaria: verifica que todos los endpoints están correctamente definidos.
 * Patrón: Module — los servicios no deben depender de URLs hardcodeadas.
 */
import { describe, it, expect } from 'vitest';
import { EP } from '../api/endpoints.js';

describe('EP (endpoints)', () => {
  describe('AUTH', () => {
    it('define LOGIN', () => expect(EP.AUTH.LOGIN).toBe('/auth/login'));
    it('define LOGOUT', () => expect(EP.AUTH.LOGOUT).toBe('/auth/logout'));
    it('define REFRESH', () => expect(EP.AUTH.REFRESH).toBe('/auth/refresh'));
    it('define ME', () => expect(EP.AUTH.ME).toBe('/auth/me'));
  });

  describe('DONACIONES', () => {
    it('define LIST', () => expect(EP.DONACIONES.LIST).toBe('/donaciones'));
    it('define CREATE', () => expect(EP.DONACIONES.CREATE).toBe('/donaciones'));
    it('define BY_ID como función', () => {
      expect(typeof EP.DONACIONES.BY_ID).toBe('function');
      expect(EP.DONACIONES.BY_ID(42)).toBe('/donaciones/42');
    });
    it('define CANCEL como función', () => {
      expect(EP.DONACIONES.CANCEL(1)).toBe('/donaciones/1/cancelar');
    });
    it('define CAMPANAS', () => expect(EP.DONACIONES.CAMPANAS).toBe('/donaciones/campanas'));
    it('define CAMPANA_BY_ID como función', () => {
      expect(EP.DONACIONES.CAMPANA_BY_ID(5)).toBe('/donaciones/campanas/5');
    });
  });

  describe('NECESIDADES', () => {
    it('define LIST', () => expect(EP.NECESIDADES.LIST).toBe('/necesidades'));
    it('define PUBLICAS', () => expect(EP.NECESIDADES.PUBLICAS).toBe('/necesidades/publicas'));
    it('define BY_ID como función', () => {
      expect(EP.NECESIDADES.BY_ID(10)).toBe('/necesidades/10');
    });
    it('define CLOSE como función', () => {
      expect(EP.NECESIDADES.CLOSE(10)).toBe('/necesidades/10/cerrar');
    });
  });

  describe('MATCHING', () => {
    it('define RESULTADOS', () => expect(EP.MATCHING.RESULTADOS).toBe('/matching/resultados'));
    it('define BY_ID como función', () => {
      expect(EP.MATCHING.BY_ID(99)).toBe('/matching/resultados/99');
    });
  });

  describe('NOTIFICACIONES', () => {
    it('define PREFS', () => expect(EP.NOTIFICACIONES.PREFS).toBe('/notificaciones/preferencias'));
    it('define UPDATE_PREFS', () => expect(EP.NOTIFICACIONES.UPDATE_PREFS).toBe('/notificaciones/preferencias'));
  });

  describe('USUARIOS', () => {
    it('define LIST', () => expect(EP.USUARIOS.LIST).toBe('/usuarios'));
    it('define BY_ID como función', () => {
      expect(EP.USUARIOS.BY_ID(7)).toBe('/usuarios/7');
    });
    it('define PERFIL', () => expect(EP.USUARIOS.PERFIL).toBe('/usuarios/perfil'));
  });
});
