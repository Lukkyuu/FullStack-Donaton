package com.donaton.backend.donacion.service;

import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.messaging.DonacionPublisher;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonacionService {

    private final DonacionRepository donacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CentroAcopioRepository centroAcopioRepository;
    private final DonacionPublisher donacionPublisher;

    private static final java.util.concurrent.CopyOnWriteArrayList<DonacionDTO.Response> MOCK_DONACIONES = new java.util.concurrent.CopyOnWriteArrayList<>();

    static {
        MOCK_DONACIONES.add(DonacionDTO.Response.builder()
                .id(1L)
                .donanteNombre("Juan Pérez")
                .centroAcopioNombre("Centro de Acopio Santiago")
                .descripcion("Caja de alimentos no perecibles")
                .categoria("ALIMENTO")
                .tipoDonacion("ALIMENTO")
                .unidad("cajas")
                .zona("Santiago Centro")
                .cantidad(10)
                .estado("PENDIENTE")
                .fechaCreacion(java.time.LocalDateTime.now().minusDays(1))
                .build());

        MOCK_DONACIONES.add(DonacionDTO.Response.builder()
                .id(2L)
                .donanteNombre("María González")
                .centroAcopioNombre("Bodega Regional Valparaíso")
                .descripcion("Sacos de frazadas y ropa de abrigo")
                .categoria("ROPA")
                .tipoDonacion("ROPA")
                .unidad("sacos")
                .zona("Valparaíso")
                .cantidad(5)
                .estado("PENDIENTE")
                .fechaCreacion(java.time.LocalDateTime.now().minusHours(3))
                .build());
    }

    private List<DonacionDTO.Response> mergeWithDb(List<DonacionDTO.Response> dbList) {
        java.util.Map<Long, DonacionDTO.Response> merged = new java.util.LinkedHashMap<>();
        
        for (DonacionDTO.Response m : MOCK_DONACIONES) {
            merged.put(m.getId(), m);
        }
        
        if (dbList != null) {
            for (DonacionDTO.Response d : dbList) {
                merged.put(d.getId(), d);
            }
        }
        
        return new java.util.ArrayList<>(merged.values());
    }

    public DonacionDTO.Response crear(DonacionDTO.Request request) {
        String email = "donante@donaton.cl";
        try {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception e) {}

        String donanteNombre = "Donante Demo";
        Usuario donante = null;

        try {
            donante = usuarioRepository.findByEmail(email).orElseThrow();
            donanteNombre = donante.getNombre();
        } catch (Exception e) {
            if (email.contains("donante")) {
                donanteNombre = "Juan Pérez (Donante)";
            } else if (email.contains("admin")) {
                donanteNombre = "Administrador";
            }
        }

        String centroNombre = null;
        CentroAcopio centro = null;
        if (request.getCentroAcopioId() != null) {
            try {
                centro = centroAcopioRepository.findById(request.getCentroAcopioId()).orElseThrow();
                centroNombre = centro.getNombre();
            } catch (Exception e) {
                centroNombre = "Centro de Acopio #" + request.getCentroAcopioId();
            }
        }

        Donacion donacionGuardada = null;
        if (donante != null) {
            try {
                Donacion donacion = Donacion.builder()
                        .donante(donante)
                        .centroAcopio(centro)
                        .descripcion(request.getDescripcion())
                        .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion())
                        .tipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria())
                        .unidad(request.getUnidad())
                        .zona(request.getZona())
                        .necesidadId(request.getNecesidadId())
                        .cantidad(request.getCantidad())
                        .estado(Donacion.EstadoDonacion.PENDIENTE)
                        .build();
                donacionGuardada = donacionRepository.save(donacion);
            } catch (Exception e) {
                System.err.println("DB Save for Donacion failed: " + e.getMessage());
            }
        }

        DonacionDTO.Response response = DonacionDTO.Response.builder()
                .id(donacionGuardada != null ? donacionGuardada.getId() : (long) (MOCK_DONACIONES.size() + 100))
                .donanteNombre(donanteNombre)
                .centroAcopioNombre(centroNombre)
                .descripcion(request.getDescripcion())
                .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion())
                .tipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria())
                .unidad(request.getUnidad())
                .zona(request.getZona())
                .necesidadId(request.getNecesidadId())
                .cantidad(request.getCantidad())
                .estado("PENDIENTE")
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        MOCK_DONACIONES.add(response);

        try {
            donacionPublisher.publicarDonacion(response);
        } catch (Exception e) {
            System.err.println("RabbitMQ publish failed: " + e.getMessage());
        }

        return response;
    }

    public List<DonacionDTO.Response> listarTodas() {
        try {
            List<DonacionDTO.Response> dbList = donacionRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
            return mergeWithDb(dbList);
        } catch (Exception e) {
            System.err.println("DB listarTodas failed: " + e.getMessage());
            return mergeWithDb(null);
        }
    }

    public List<DonacionDTO.Response> listarPorDonante() {
        String email = "donante@donaton.cl";
        try {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception e) {}

        try {
            Usuario donante = usuarioRepository.findByEmail(email).orElseThrow();
            List<DonacionDTO.Response> dbList = donacionRepository.findByDonanteId(donante.getId()).stream()
                    .map(this::toResponse).collect(Collectors.toList());
            
            final String finalEmail = email;
            String donanteNombre = donante.getNombre();
            List<DonacionDTO.Response> merged = mergeWithDb(dbList);
            return merged.stream()
                    .filter(d -> d.getDonanteNombre().equalsIgnoreCase(donanteNombre)
                              || "donante@donaton.cl".equals(finalEmail)
                              || d.getDonanteNombre().contains("Demo")
                              || d.getDonanteNombre().contains("Pérez"))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("DB listarPorDonante failed: " + e.getMessage());
            return new java.util.ArrayList<>(MOCK_DONACIONES);
        }
    }

    public DonacionDTO.Response obtenerPorId(Long id) {
        try {
            Donacion donacion = donacionRepository.findById(id).orElseThrow();
            return toResponse(donacion);
        } catch (Exception e) {
            for (DonacionDTO.Response m : MOCK_DONACIONES) {
                if (m.getId().equals(id)) {
                    return m;
                }
            }
            throw new RuntimeException("Donacion no encontrada: " + id);
        }
    }

    public DonacionDTO.Response actualizar(Long id, DonacionDTO.Request request) {
        for (DonacionDTO.Response m : MOCK_DONACIONES) {
            if (m.getId().equals(id)) {
                m.setDescripcion(request.getDescripcion());
                m.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion());
                m.setTipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria());
                m.setUnidad(request.getUnidad());
                m.setZona(request.getZona());
                m.setNecesidadId(request.getNecesidadId());
                m.setCantidad(request.getCantidad());
                
                try {
                    Donacion donacion = donacionRepository.findById(id).orElseThrow();
                    donacion.setDescripcion(request.getDescripcion());
                    donacion.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion());
                    donacion.setTipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria());
                    donacion.setUnidad(request.getUnidad());
                    donacion.setZona(request.getZona());
                    donacion.setNecesidadId(request.getNecesidadId());
                    donacion.setCantidad(request.getCantidad());
                    donacionRepository.save(donacion);
                } catch (Exception ex) {
                    System.err.println("DB update failed: " + ex.getMessage());
                }
                return m;
            }
        }
        throw new RuntimeException("Donacion no encontrada: " + id);
    }

    public DonacionDTO.Response cancelar(Long id) {
        for (DonacionDTO.Response m : MOCK_DONACIONES) {
            if (m.getId().equals(id)) {
                m.setEstado("CANCELADA");
                try {
                    Donacion donacion = donacionRepository.findById(id).orElseThrow();
                    donacion.setEstado(Donacion.EstadoDonacion.CANCELADA);
                    donacionRepository.save(donacion);
                } catch (Exception ex) {
                    System.err.println("DB cancel failed: " + ex.getMessage());
                }
                return m;
            }
        }
        throw new RuntimeException("Donacion no encontrada: " + id);
    }

    public DonacionDTO.Response actualizarEstado(Long id, String estado) {
        for (DonacionDTO.Response m : MOCK_DONACIONES) {
            if (m.getId().equals(id)) {
                m.setEstado(estado.toUpperCase());
                try {
                    Donacion donacion = donacionRepository.findById(id).orElseThrow();
                    donacion.setEstado(Donacion.EstadoDonacion.valueOf(estado.toUpperCase()));
                    donacionRepository.save(donacion);
                } catch (Exception ex) {
                    System.err.println("DB state update failed: " + ex.getMessage());
                }
                return m;
            }
        }
        throw new RuntimeException("Donacion no encontrada: " + id);
    }

    private DonacionDTO.Response toResponse(Donacion d) {
        return DonacionDTO.Response.builder()
                .id(d.getId())
                .donanteNombre(d.getDonante() != null ? d.getDonante().getNombre() : "Juan Pérez")
                .centroAcopioNombre(d.getCentroAcopio() != null ? d.getCentroAcopio().getNombre() : null)
                .descripcion(d.getDescripcion())
                .categoria(d.getCategoria())
                .tipoDonacion(d.getTipoDonacion() != null ? d.getTipoDonacion() : d.getCategoria())
                .unidad(d.getUnidad())
                .zona(d.getZona())
                .necesidadId(d.getNecesidadId())
                .cantidad(d.getCantidad())
                .estado(d.getEstado() != null ? d.getEstado().name() : null)
                .fechaCreacion(d.getFechaCreacion())
                .build();
    }
}
