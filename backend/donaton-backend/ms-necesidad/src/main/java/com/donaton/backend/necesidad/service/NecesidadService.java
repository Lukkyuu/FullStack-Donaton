package com.donaton.backend.necesidad.service;

import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
import com.donaton.backend.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NecesidadService {

    private final NecesidadRepository necesidadRepository;
    private final UsuarioRepository usuarioRepository;

    private static final java.util.concurrent.CopyOnWriteArrayList<NecesidadDTO.Response> MOCK_NECESIDADES = new java.util.concurrent.CopyOnWriteArrayList<>();

    static {
        MOCK_NECESIDADES.add(NecesidadDTO.Response.builder()
                .id(1L)
                .beneficiarioNombre("Fundación Ayuda Chile")
                .organizacion("Fundación Ayuda Chile")
                .descripcion("Se necesitan alimentos no perecibles para familias afectadas por temporales.")
                .categoria("ALIMENTO")
                .tipoNecesidad("ALIMENTO")
                .urgencia("ALTA")
                .unidad("kg")
                .zona("Valparaíso")
                .cantidadRequerida(500)
                .estado("ACTIVA")
                .fechaCreacion(java.time.LocalDateTime.now().minusDays(2))
                .build());

        MOCK_NECESIDADES.add(NecesidadDTO.Response.builder()
                .id(2L)
                .beneficiarioNombre("Hogar de Cristo")
                .organizacion("Hogar de Cristo")
                .descripcion("Ropa de abrigo y frazadas para personas en situación de calle.")
                .categoria("ROPA")
                .tipoNecesidad("ROPA")
                .urgencia("ALTA")
                .unidad("unidades")
                .zona("Santiago")
                .cantidadRequerida(200)
                .estado("ACTIVA")
                .fechaCreacion(java.time.LocalDateTime.now().minusDays(1))
                .build());

        MOCK_NECESIDADES.add(NecesidadDTO.Response.builder()
                .id(3L)
                .beneficiarioNombre("Cruz Roja Chilena")
                .organizacion("Cruz Roja Chilena")
                .descripcion("Insumos médicos básicos y paracetamol para operativo de salud.")
                .categoria("MEDICINA")
                .tipoNecesidad("MEDICINA")
                .urgencia("MEDIA")
                .unidad("cajas")
                .zona("Concepción")
                .cantidadRequerida(100)
                .estado("ACTIVA")
                .fechaCreacion(java.time.LocalDateTime.now().minusHours(5))
                .build());

        MOCK_NECESIDADES.add(NecesidadDTO.Response.builder()
                .id(4L)
                .beneficiarioNombre("Techo Chile")
                .organizacion("Techo Chile")
                .descripcion("Fondos para la reconstrucción de viviendas de emergencia.")
                .categoria("DINERO")
                .tipoNecesidad("DINERO")
                .urgencia("ALTA")
                .unidad("CLP")
                .zona("Biobío")
                .cantidadRequerida(1500000)
                .estado("ACTIVA")
                .fechaCreacion(java.time.LocalDateTime.now().minusHours(12))
                .build());
    }

    private List<NecesidadDTO.Response> mergeWithDb(List<NecesidadDTO.Response> dbList) {
        java.util.Map<Long, NecesidadDTO.Response> merged = new java.util.LinkedHashMap<>();
        
        for (NecesidadDTO.Response m : MOCK_NECESIDADES) {
            merged.put(m.getId(), m);
        }
        
        if (dbList != null) {
            for (NecesidadDTO.Response d : dbList) {
                merged.put(d.getId(), d);
            }
        }
        
        return new java.util.ArrayList<>(merged.values());
    }

    public NecesidadDTO.Response crear(NecesidadDTO.Request request) {
        String email = "anonimo@donaton.cl";
        try {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception e) {}

        String orgNombre = "Fundación Demo";
        Usuario beneficiario = null;

        try {
            beneficiario = usuarioRepository.findByEmail(email).orElseThrow();
            orgNombre = beneficiario.getNombre();
        } catch (Exception e) {
            if (email.contains("org") || email.contains("fundacion")) {
                orgNombre = "Organización Demo";
            } else if (email.contains("admin")) {
                orgNombre = "Administrador";
            }
        }

        NecesidadDTO.Response response = NecesidadDTO.Response.builder()
                .id((long) (MOCK_NECESIDADES.size() + 100))
                .beneficiarioNombre(orgNombre)
                .organizacion(orgNombre)
                .descripcion(request.getDescripcion())
                .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad())
                .tipoNecesidad(request.getTipoNecesidad() != null ? request.getTipoNecesidad() : request.getCategoria())
                .urgencia(request.getUrgencia())
                .unidad(request.getUnidad())
                .zona(request.getZona())
                .cantidadRequerida(request.getCantidadRequerida())
                .estado("ACTIVA")
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        MOCK_NECESIDADES.add(response);

        if (beneficiario != null) {
            try {
                Necesidad necesidad = Necesidad.builder()
                        .beneficiario(beneficiario)
                        .descripcion(request.getDescripcion())
                        .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad())
                        .tipoNecesidad(request.getTipoNecesidad() != null ? request.getTipoNecesidad() : request.getCategoria())
                        .urgencia(request.getUrgencia())
                        .unidad(request.getUnidad())
                        .zona(request.getZona())
                        .cantidadRequerida(request.getCantidadRequerida())
                        .estado(Necesidad.EstadoNecesidad.ACTIVA)
                        .build();
                necesidadRepository.save(necesidad);
            } catch (Exception e) {
                System.err.println("DB Save failed, saved only in memory: " + e.getMessage());
            }
        }

        return response;
    }

    public List<NecesidadDTO.Response> listarActivas() {
        try {
            List<NecesidadDTO.Response> dbList = necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA)
                    .stream().map(this::toResponse).collect(Collectors.toList());
            return mergeWithDb(dbList);
        } catch (Exception e) {
            System.err.println("DB list failed, returning memory only: " + e.getMessage());
            return mergeWithDb(null);
        }
    }

    public List<NecesidadDTO.Response> listarPorBeneficiario() {
        String email = "anonimo@donaton.cl";
        try {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception e) {}

        try {
            Usuario beneficiario = usuarioRepository.findByEmail(email).orElseThrow();
            List<NecesidadDTO.Response> dbList = necesidadRepository.findByBeneficiarioId(beneficiario.getId())
                    .stream().map(this::toResponse).collect(Collectors.toList());
            
            final String finalEmail = email;
            String orgNombre = beneficiario.getNombre();
            List<NecesidadDTO.Response> merged = mergeWithDb(dbList);
            return merged.stream()
                    .filter(n -> n.getBeneficiarioNombre().equalsIgnoreCase(orgNombre) 
                              || "anonimo@donaton.cl".equals(finalEmail) 
                              || n.getBeneficiarioNombre().contains("Demo"))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("DB list by beneficiary failed: " + e.getMessage());
            return new java.util.ArrayList<>(MOCK_NECESIDADES);
        }
    }

    public NecesidadDTO.Response obtenerPorId(Long id) {
        try {
            Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
            return toResponse(necesidad);
        } catch (Exception e) {
            for (NecesidadDTO.Response m : MOCK_NECESIDADES) {
                if (m.getId().equals(id)) {
                    return m;
                }
            }
            throw new RuntimeException("Necesidad no encontrada: " + id);
        }
    }

    public List<NecesidadDTO.Response> listarPublicas() {
        return listarActivas();
    }

    @org.springframework.beans.factory.annotation.Value("${spring.datasource.url:no-defined}")
    private String dbUrl;

    public java.util.Map<String, Object> testDatabaseConnection() {
        java.util.Map<String, Object> report = new java.util.HashMap<>();
        report.put("dbUrl", dbUrl);
        try {
            long userCount = usuarioRepository.count();
            long needCount = necesidadRepository.count();
            report.put("status", "UP");
            report.put("usersCount", userCount);
            report.put("needsCount", needCount);
            
            org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                String email = auth.getName();
                report.put("currentUserEmail", email);
                report.put("currentUserExists", usuarioRepository.findByEmail(email).isPresent());
            } else {
                report.put("currentUser", "anonymousOrNull");
            }
        } catch (Exception e) {
            report.put("status", "DOWN");
            report.put("error", e.getMessage());
        }
        return report;
    }

    public NecesidadDTO.Response actualizar(Long id, NecesidadDTO.Request request) {
        for (NecesidadDTO.Response m : MOCK_NECESIDADES) {
            if (m.getId().equals(id)) {
                m.setDescripcion(request.getDescripcion());
                m.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad());
                m.setTipoNecesidad(request.getTipoNecesidad() != null ? request.getTipoNecesidad() : request.getCategoria());
                m.setUrgencia(request.getUrgencia());
                m.setUnidad(request.getUnidad());
                m.setZona(request.getZona());
                m.setCantidadRequerida(request.getCantidadRequerida());
                
                try {
                    Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
                    necesidad.setDescripcion(request.getDescripcion());
                    necesidad.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad());
                    necesidad.setTipoNecesidad(request.getTipoNecesidad() != null ? request.getTipoNecesidad() : request.getCategoria());
                    necesidad.setUrgencia(request.getUrgencia());
                    necesidad.setUnidad(request.getUnidad());
                    necesidad.setZona(request.getZona());
                    necesidad.setCantidadRequerida(request.getCantidadRequerida());
                    necesidadRepository.save(necesidad);
                } catch (Exception ex) {
                    System.err.println("DB update failed: " + ex.getMessage());
                }
                return m;
            }
        }
        throw new RuntimeException("Necesidad no encontrada: " + id);
    }

    public NecesidadDTO.Response actualizarEstado(Long id, String estado) {
        for (NecesidadDTO.Response m : MOCK_NECESIDADES) {
            if (m.getId().equals(id)) {
                m.setEstado(estado.toUpperCase());
                try {
                    Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
                    necesidad.setEstado(Necesidad.EstadoNecesidad.valueOf(estado.toUpperCase()));
                    necesidadRepository.save(necesidad);
                } catch (Exception ex) {
                    System.err.println("DB state update failed: " + ex.getMessage());
                }
                return m;
            }
        }
        throw new RuntimeException("Necesidad no encontrada: " + id);
    }

    private NecesidadDTO.Response toResponse(Necesidad n) {
        String orgNombre = n.getBeneficiario() != null ? n.getBeneficiario().getNombre() : "Anónimo";
        return NecesidadDTO.Response.builder()
                .id(n.getId())
                .beneficiarioNombre(orgNombre)
                .organizacion(orgNombre)
                .descripcion(n.getDescripcion())
                .categoria(n.getCategoria())
                .tipoNecesidad(n.getTipoNecesidad() != null ? n.getTipoNecesidad() : n.getCategoria())
                .urgencia(n.getUrgencia())
                .unidad(n.getUnidad())
                .zona(n.getZona())
                .cantidadRequerida(n.getCantidadRequerida())
                .estado(n.getEstado() != null ? n.getEstado().name() : null)
                .fechaCreacion(n.getFechaCreacion())
                .build();
    }
}
