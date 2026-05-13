import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const notificacionesService = {
  getPreferencias: () =>
    apiClient.get(EP.NOTIFICACIONES.PREFS),

  updatePreferencias: (data) =>
    apiClient.put(EP.NOTIFICACIONES.UPDATE_PREFS, data),
};
