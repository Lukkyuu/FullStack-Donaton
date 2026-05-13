import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const logisticaService = {
  listarRecursos:      (params) => apiClient.get(EP.LOGISTICA.RECURSOS, { params }),
  obtenerRecurso:      (id)     => apiClient.get(EP.LOGISTICA.RECURSO_BY_ID(id)),
  crearRecurso:        (data)   => apiClient.post(EP.LOGISTICA.CREAR_RECURSO, data),
  listarDistribuciones:(params) => apiClient.get(EP.LOGISTICA.DISTRIBUCIONES, { params }),
  crearDistribucion:   (data)   => apiClient.post(EP.LOGISTICA.CREAR_DIST, data),
  obtenerDistribucion: (id)     => apiClient.get(EP.LOGISTICA.DIST_BY_ID(id)),
};
