import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const necesidadesService = {
  listar:   (params) => apiClient.get(EP.NECESIDADES.LIST, { params }),
  publicas: (params) => apiClient.get(EP.NECESIDADES.PUBLICAS, { params }),
  obtener:  (id)     => apiClient.get(EP.NECESIDADES.BY_ID(id)),
  crear:    (data)   => apiClient.post(EP.NECESIDADES.CREATE, data),
  actualizar:(id, data) => apiClient.put(EP.NECESIDADES.UPDATE(id), data),
  cerrar:   (id)     => apiClient.patch(EP.NECESIDADES.CLOSE(id)),
};
