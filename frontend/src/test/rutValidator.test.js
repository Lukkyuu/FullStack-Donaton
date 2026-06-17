import { describe, it, expect } from 'vitest';
import { validarRut, formatRutInput } from '../shared/utils/rutValidator.js';

describe('rutValidator', () => {
  describe('validarRut', () => {
    it('retorna error si el RUT es nulo o no es string', () => {
      expect(validarRut(null)).toEqual({ valid: false, error: 'RUT requerido', formatted: '' });
      expect(validarRut(12345678)).toEqual({ valid: false, error: 'RUT requerido', formatted: '' });
    });

    it('retorna error si el RUT es demasiado corto', () => {
      expect(validarRut('1')).toEqual({ valid: false, error: 'RUT muy corto', formatted: '1' });
    });

    it('retorna error si contiene caracteres no numéricos en el cuerpo', () => {
      expect(validarRut('12.a45.678-9')).toEqual({
        valid: false,
        error: 'El RUT solo puede contener números y guión',
        formatted: '12.a45.678-9'
      });
    });

    it('valida un RUT correcto con guión y puntos', () => {
      expect(validarRut('19.985.340-6').valid).toBe(true);
      expect(validarRut('19985340-6').valid).toBe(true);
      expect(validarRut('19.985.340-6').formatted).toBe('19.985.340-6');
    });

    it('valida RUTs con DV K y 2', () => {
      expect(validarRut('18.892.428-K').valid).toBe(true);
      expect(validarRut('19.345.678-2').valid).toBe(true);
    });

    it('retorna error si el DV es incorrecto', () => {
      expect(validarRut('19.985.340-1')).toEqual({
        valid: false,
        error: 'El dígito verificador del RUT es incorrecto',
        formatted: '19.985.340-1'
      });
    });
  });

  describe('formatRutInput', () => {
    it('retorna vacío si la entrada es vacía', () => {
      expect(formatRutInput('')).toBe('');
    });

    it('retorna sólo el DV si es de longitud 1', () => {
      expect(formatRutInput('k')).toBe('K');
    });

    it('formatea un RUT correctamente a medida que se escribe', () => {
      expect(formatRutInput('199853400')).toBe('19.985.340-0');
      expect(formatRutInput('19985340K')).toBe('19.985.340-K');
    });
  });
});
