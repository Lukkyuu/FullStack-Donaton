import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../shared/hooks/useApi.js';

describe('useApi Hook', () => {
  it('calls serviceFn immediately by default', async () => {
    const serviceFn = vi.fn().mockResolvedValue({ data: { hello: 'world' } });
    const { result } = renderHook(() => useApi(serviceFn));

    expect(result.current.loading).toBe(true);

    // Wait for the effect to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ hello: 'world' });
    expect(result.current.error).toBeNull();
    expect(result.current.degraded).toBe(false);
  });

  it('does not call serviceFn immediately if immediate is false', async () => {
    const serviceFn = vi.fn().mockResolvedValue({ data: { hello: 'world' } });
    const { result } = renderHook(() => useApi(serviceFn, [], false));

    expect(result.current.loading).toBe(false);
    expect(serviceFn).not.toHaveBeenCalled();

    let res;
    await act(async () => {
      res = await result.current.refetch();
    });

    expect(res).toEqual({ hello: 'world' });
    expect(result.current.data).toEqual({ hello: 'world' });
  });

  it('handles degraded mode metadata in response', async () => {
    const serviceFn = vi.fn().mockResolvedValue({ data: { hello: 'world', _meta: { degraded: true } } });
    const { result } = renderHook(() => useApi(serviceFn));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
    });

    expect(result.current.degraded).toBe(true);
  });

  it('handles API errors', async () => {
    const errorObj = { response: { data: { message: 'Server is down' } } };
    const serviceFn = vi.fn().mockRejectedValue(errorObj);
    const { result } = renderHook(() => useApi(serviceFn));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Server is down');
    expect(result.current.data).toBeNull();
  });
});
