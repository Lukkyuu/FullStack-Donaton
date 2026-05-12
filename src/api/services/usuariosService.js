import apiClient from '../axiosClient.js';
import { EP } from '../endpoints.js';

export const usuariosService = {
  listar:    (params)    => apiClient.get(EP.USUARIOS.LIST, { params }),
  obtener:   (id)        => apiClient.get(EP.USUARIOS.BY_ID(id)),
  crear:     (data)      => apiClient.post(EP.USUARIOS.CREATE, data),
  actualizar:(id, data)  => apiClient.put(EP.USUARIOS.UPDATE(id), data),
  eliminar:  (id)        => apiClient.delete(EP.USUARIOS.DELETE(id)),
  perfil:    ()          => apiClient.get(EP.USUARIOS.PERFIL),
};
