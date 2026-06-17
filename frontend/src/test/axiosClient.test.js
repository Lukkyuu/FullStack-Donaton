import { describe, it, expect, vi } from 'vitest';
import apiClient, { bindAuthHelpers, getAccessToken, setAccessToken, clearSession } from '../api/axiosClient.js';

describe('axiosClient', () => {
  it('binds auth helpers correctly', () => {
    const get = () => 'test-token';
    const set = vi.fn();
    const clear = vi.fn();
    
    bindAuthHelpers(get, set, clear);
    
    expect(getAccessToken()).toBe('test-token');
    
    setAccessToken('new-token');
    expect(set).toHaveBeenCalledWith('new-token');
    
    clearSession();
    expect(clear).toHaveBeenCalled();
  });

  it('adds bearer token to headers if present in request interceptor', () => {
    const requestInterceptor = apiClient.interceptors.request.handlers[0].fulfilled;
    
    bindAuthHelpers(() => 'token-123', () => {}, () => {});
    const config = requestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('does not add bearer token if absent', () => {
    const requestInterceptor = apiClient.interceptors.request.handlers[0].fulfilled;
    bindAuthHelpers(() => null, () => {}, () => {});
    const config = requestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('adds metadata to degraded responses', () => {
    const responseInterceptor = apiClient.interceptors.response.handlers[0].fulfilled;
    const response = { data: { _degraded: true } };
    const res = responseInterceptor(response);
    expect(res.data._meta).toEqual({ degraded: true, source: 'cache' });
  });

  it('passes through normal responses', () => {
    const responseInterceptor = apiClient.interceptors.response.handlers[0].fulfilled;
    const response = { data: { name: 'Normal' } };
    const res = responseInterceptor(response);
    expect(res.data._meta).toBeUndefined();
  });

  it('rejects with _degraded: true on 503 status code', async () => {
    const responseInterceptorError = apiClient.interceptors.response.handlers[0].rejected;
    const errorObj = {
      response: { status: 503 },
      config: { url: '/test' }
    };
    
    let caught;
    try {
      await responseInterceptorError(errorObj);
    } catch (e) {
      caught = e;
    }
    
    expect(caught._degraded).toBe(true);
  });

  it('retries request on 401 by calling refresh endpoint', async () => {
    const responseInterceptorError = apiClient.interceptors.response.handlers[0].rejected;
    
    let setTokenVal = null;
    bindAuthHelpers(() => 'old-token', (token) => { setTokenVal = token; }, () => {});
    
    const originalAdapter = apiClient.defaults.adapter;
    apiClient.defaults.adapter = vi.fn().mockImplementation((config) => {
      if (config.url.includes('/auth/refresh') || config.url === '/auth/refresh') {
        return Promise.resolve({
          data: { accessToken: 'refreshed-token' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
      }
      return Promise.resolve({
        data: 'refreshed-data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
    });
    
    const errorObj = {
      response: { status: 401 },
      config: {
        url: '/some-secure-endpoint',
        headers: {},
        _retry: false
      }
    };
    
    const res = await responseInterceptorError(errorObj);
    expect(res.data).toBe('refreshed-data');
    expect(setTokenVal).toBe('refreshed-token');
    
    apiClient.defaults.adapter = originalAdapter;
  });

  it('clears session on refresh failure', async () => {
    const responseInterceptorError = apiClient.interceptors.response.handlers[0].rejected;
    
    let cleared = false;
    bindAuthHelpers(() => 'old-token', () => {}, () => { cleared = true; });
    
    const originalAdapter = apiClient.defaults.adapter;
    apiClient.defaults.adapter = vi.fn().mockImplementation((config) => {
      if (config.url.includes('/auth/refresh') || config.url === '/auth/refresh') {
        return Promise.reject({
          response: {
            status: 401,
            data: { message: 'Refresh failed' }
          }
        });
      }
      return Promise.resolve({ data: {}, status: 200, headers: {}, config });
    });
    
    const errorObj = {
      response: { status: 401 },
      config: {
        url: '/some-secure-endpoint',
        headers: {},
        _retry: false
      }
    };
    
    let error;
    try {
      await responseInterceptorError(errorObj);
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(cleared).toBe(true);
    
    apiClient.defaults.adapter = originalAdapter;
  });
});
