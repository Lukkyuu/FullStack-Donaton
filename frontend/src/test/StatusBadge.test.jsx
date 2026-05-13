/**
 * StatusBadge.test.jsx
 * Prueba unitaria: componente StatusBadge renderiza correctamente para cada estado.
 * Patrón: Composite — componentes reutilizables con comportamiento predecible.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../shared/components/index.jsx';

describe('StatusBadge', () => {
  const casos = [
    { status: 'PENDIENTE',   expectedClass: 'badge-amber' },
    { status: 'ACTIVO',      expectedClass: 'badge-green' },
    { status: 'ACTIVA',      expectedClass: 'badge-green' },
    { status: 'COMPLETADO',  expectedClass: 'badge-blue'  },
    { status: 'COMPLETADA',  expectedClass: 'badge-blue'  },
    { status: 'CANCELADO',   expectedClass: 'badge-red'   },
    { status: 'CANCELADA',   expectedClass: 'badge-red'   },
    { status: 'EN_TRANSITO', expectedClass: 'badge-coral' },
    { status: 'ENTREGADO',   expectedClass: 'badge-green' },
    { status: 'CERRADA',     expectedClass: 'badge-gray'  },
  ];

  casos.forEach(({ status, expectedClass }) => {
    it(`renderiza estado "${status}" con clase "${expectedClass}"`, () => {
      render(<StatusBadge status={status} />);
      const badge = screen.getByText(status);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass(expectedClass);
    });
  });

  it('usa badge-gray para estado desconocido', () => {
    render(<StatusBadge status="DESCONOCIDO" />);
    const badge = screen.getByText('DESCONOCIDO');
    expect(badge).toHaveClass('badge-gray');
  });

  it('maneja status undefined sin explotar', () => {
    render(<StatusBadge status={undefined} />);
    // No debe lanzar error, el badge debe existir
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBe(1);
  });
});
