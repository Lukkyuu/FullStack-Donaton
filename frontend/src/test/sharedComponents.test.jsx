import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  LoadingSpinner,
  DegradedBanner,
  ErrorBox,
  EmptyState,
  Modal,
  ConfirmModal,
  Topbar,
} from '../shared/components/index.jsx';
import { ToastProvider, useToast } from '../shared/components/Toast.jsx';

describe('Shared Components', () => {
  describe('LoadingSpinner', () => {
    it('renderiza con texto por defecto', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('renderiza con texto personalizado', () => {
      render(<LoadingSpinner text="Procesando pago..." />);
      expect(screen.getByText('Procesando pago...')).toBeInTheDocument();
    });
  });

  describe('DegradedBanner', () => {
    it('retorna null si show es falso', () => {
      const { container } = render(<DegradedBanner show={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza banner normal si show es verdadero y prominent es falso', () => {
      render(<DegradedBanner show={true} prominent={false} />);
      expect(screen.getByText(/Mostrando datos cacheados/)).toBeInTheDocument();
    });

    it('renderiza banner prominente si show es verdadero y prominent es verdadero', () => {
      render(<DegradedBanner show={true} prominent={true} />);
      expect(screen.getByText(/Modo degradado:/)).toBeInTheDocument();
    });
  });

  describe('ErrorBox', () => {
    it('retorna null si no hay mensaje', () => {
      const { container } = render(<ErrorBox message="" />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza mensaje de error', () => {
      render(<ErrorBox message="Error de red" />);
      expect(screen.getByText(/Error de red/)).toBeInTheDocument();
    });

    it('renderiza botón de reintento si se le provee la prop onRetry', () => {
      const onRetry = vi.fn();
      render(<ErrorBox message="Error" onRetry={onRetry} />);
      const btn = screen.getByRole('button', { name: 'Reintentar' });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyState', () => {
    it('renderiza el estado vacío con sus detalles', () => {
      render(<EmptyState icon="👻" title="No hay fantasmas" description="Todo limpio" />);
      expect(screen.getByText('👻')).toBeInTheDocument();
      expect(screen.getByText('No hay fantasmas')).toBeInTheDocument();
      expect(screen.getByText('Todo limpio')).toBeInTheDocument();
    });

    it('renderiza acción personalizada', () => {
      render(<EmptyState action={<button>Crear nuevo</button>} />);
      expect(screen.getByRole('button', { name: 'Crear nuevo' })).toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    it('retorna null si open es falso', () => {
      const { container } = render(<Modal open={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza el modal cuando open es verdadero y reacciona al cierre', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} title="Mi Modal" onClose={onClose}>
          <div>Cuerpo del modal</div>
        </Modal>
      );
      expect(screen.getByText('Mi Modal')).toBeInTheDocument();
      expect(screen.getByText('Cuerpo del modal')).toBeInTheDocument();

      const closeBtn = screen.getByText('✕');
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConfirmModal', () => {
    it('retorna null si open es falso', () => {
      const { container } = render(<ConfirmModal open={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza confirmación y responde a confirm/cancel', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      render(
        <ConfirmModal
          open={true}
          title="¿Confirmar acción?"
          description="Esta acción es irreversible"
          onConfirm={onConfirm}
          onCancel={onCancel}
          danger={true}
        />
      );

      expect(screen.getByText('¿Confirmar acción?')).toBeInTheDocument();
      expect(screen.getByText('Esta acción es irreversible')).toBeInTheDocument();

      const confirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });

      fireEvent.click(confirmBtn);
      expect(onConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(cancelBtn);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Topbar', () => {
    it('renderiza información del usuario', () => {
      render(<Topbar title="Mi Panel" role="ADMIN" userName="Juan Pérez" />);
      expect(screen.getByText('Mi Panel')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });
  });

  describe('Toast', () => {
    it('lanza error si useToast se usa fuera de ToastProvider', () => {
      const TestComponent = () => {
        useToast();
        return null;
      };
      expect(() => render(<TestComponent />)).toThrow('useToast debe usarse dentro de ToastProvider');
    });

    it('muestra y oculta notificaciones Toast', () => {
      vi.useFakeTimers();
      const TestComponent = () => {
        const toast = useToast();
        return <button onClick={() => toast('Prueba exitosa', { type: 'success' })}>Disparar</button>;
      };

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const btn = screen.getByRole('button', { name: 'Disparar' });
      fireEvent.click(btn);

      expect(screen.getByText('Prueba exitosa')).toBeInTheDocument();

      // Avanzar timer de salida
      act(() => {
        vi.advanceTimersByTime(3500);
      });
      // Avanzar el timeout de remover del DOM (320ms)
      act(() => {
        vi.advanceTimersByTime(320);
      });

      expect(screen.queryByText('Prueba exitosa')).not.toBeInTheDocument();
      vi.useRealTimers();
    });
  });
});
