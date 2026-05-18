/**
 * Valida un RUT chileno con su dígito verificador.
 * Formatos aceptados: 12.345.678-9 | 12345678-9 | 123456789
 * @param {string} rut
 * @returns {{ valid: boolean, formatted: string, error: string }}
 */
export function validarRut(rut) {
  if (!rut || typeof rut !== 'string') return { valid: false, error: 'RUT requerido', formatted: '' };

  // Limpiar puntos, guiones y espacios
  const clean = rut.replace(/[\.\-\s]/g, '').toUpperCase();
  if (clean.length < 2) return { valid: false, error: 'RUT muy corto', formatted: rut };

  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);

  if (!/^\d+$/.test(body)) return { valid: false, error: 'El RUT solo puede contener números y guión', formatted: rut };

  // Calcular dígito verificador
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const expected = 11 - (sum % 11);
  const dvExpected = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);

  if (dv !== dvExpected) {
    return { valid: false, error: 'El dígito verificador del RUT es incorrecto', formatted: rut };
  }

  // Formatear: 12.345.678-9
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  return { valid: true, error: '', formatted };
}

/**
 * Formatea un RUT mientras el usuario escribe
 * @param {string} rawInput
 * @returns {string}
 */
export function formatRutInput(rawInput) {
  const clean = rawInput.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length === 0) return '';
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);
  if (body.length === 0) return dv;
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}
