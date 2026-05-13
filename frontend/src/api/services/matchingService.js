import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const matchingService = {
  listarResultados: (params) => apiClient.get(EP.MATCHING.RESULTADOS, { params }),
  obtenerResultado: (id)     => apiClient.get(EP.MATCHING.BY_ID(id)),
};
