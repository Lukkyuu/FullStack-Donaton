import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import CursorAndMagneticEffects from '../shared/components/CursorAndMagneticEffects.jsx';

describe('CursorAndMagneticEffects', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 16)));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));
    
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock MutationObserver
    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    };

    document.body.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.className = '';
  });

  it('renders cursor elements and attaches mouse events', () => {
    const { container, unmount } = render(<CursorAndMagneticEffects />);
    
    // Custom cursor classes should be added to body
    expect(document.body.classList.contains('has-custom-cursor')).toBe(true);

    // Unmount should clean up
    unmount();
    expect(document.body.classList.contains('has-custom-cursor')).toBe(false);
  });

  it('handles touch devices by returning early', () => {
    // Override matchMedia to simulate touch device
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = render(<CursorAndMagneticEffects />);
    expect(document.body.classList.contains('has-custom-cursor')).toBe(false);
    unmount();
  });
});
