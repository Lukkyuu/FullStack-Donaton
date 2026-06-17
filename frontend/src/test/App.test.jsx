import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import App from '../App.jsx';

// Mock AppRouter to prevent actual routing/api calls
vi.mock('../router/AppRouter.jsx', () => ({
  default: () => <div data-testid="app-router">App Router Mock</div>
}));

vi.mock('../api/axiosClient.js', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { token: 'fake.eyJzdWIiOiIxIiwibm9tYnJlIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2wiLCJyb2xlIjoiRE9OQU5URSJ9.sig' } }),
  },
  bindAuthHelpers: vi.fn(),
}));

describe('App Component and GlobalEffects', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 16)));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));
    
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

    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    };

    global.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders App with all providers and mocks', async () => {
    const { getByTestId, unmount } = render(<App />);
    
    // Advance timers to clear splash screen
    await act(async () => {
      vi.advanceTimersByTime(1250);
      await Promise.resolve();
    });

    expect(getByTestId('app-router')).toBeInTheDocument();

    // Click a ripple button to cover ripple effect logic
    const button = document.createElement('button');
    button.className = 'ripple-btn';
    document.body.appendChild(button);

    fireEvent.click(button);

    // Clean up
    unmount();
    button.remove();
  });
});
