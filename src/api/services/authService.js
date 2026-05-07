import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const authService = {
  login:   (email, password) =>
    apiClient.post(EP.AUTH.LOGIN, { email, password }),

  logout:  () =>
    apiClient.post(EP.AUTH.LOGOUT),

  refresh: () =>
    apiClient.post(EP.AUTH.REFRESH),

  me:      () =>
    apiClient.get(EP.AUTH.ME),
};
