import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const donacionesService = {
  listar:         (params) => apiClient.get(EP.DONACIONES.LIST, { params }),
  listarMias:     (params) => apiClient.get(EP.DONACIONES.MIS_DONACIONES, { params }),
  obtener:        (id)     => apiClient.get(EP.DONACIONES.BY_ID(id)),
  crear:          (data)   => apiClient.post(EP.DONACIONES.CREATE, data),
  actualizar:     (id, data) => apiClient.put(EP.DONACIONES.UPDATE(id), data),
  cancelar:       (id)     => apiClient.patch(EP.DONACIONES.CANCEL(id)),
  listarCampanas: (params) => apiClient.get(EP.DONACIONES.CAMPANAS, { params }),
  obtenerCampana: (id)     => apiClient.get(EP.DONACIONES.CAMPANA_BY_ID(id)),
};
