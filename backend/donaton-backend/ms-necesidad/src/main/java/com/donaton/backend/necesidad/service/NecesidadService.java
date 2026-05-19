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

    public NecesidadDTO.Response crear(NecesidadDTO.Request request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario beneficiario = usuarioRepository.findByEmail(email).orElseThrow();

        Necesidad necesidad = Necesidad.builder()
                .beneficiario(beneficiario)
                .descripcion(request.getDescripcion())
                .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad())
                .tipoNecesidad(request.getTipoNecesidad())
                .urgencia(request.getUrgencia())
                .unidad(request.getUnidad())
                .zona(request.getZona())
                .cantidadRequerida(request.getCantidadRequerida())
                .estado(Necesidad.EstadoNecesidad.ACTIVA)
                .build();

        return toResponse(necesidadRepository.save(necesidad));
    }

    public List<NecesidadDTO.Response> listarActivas() {
        return necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NecesidadDTO.Response> listarPorBeneficiario() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario beneficiario = usuarioRepository.findByEmail(email).orElseThrow();
        return necesidadRepository.findByBeneficiarioId(beneficiario.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public NecesidadDTO.Response obtenerPorId(Long id) {
        Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
        return toResponse(necesidad);
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario beneficiario = usuarioRepository.findByEmail(email).orElseThrow();

        Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
        
        if (necesidad.getBeneficiario() == null || !necesidad.getBeneficiario().getId().equals(beneficiario.getId())) {
            throw new RuntimeException("No tienes permiso para editar esta necesidad");
        }

        necesidad.setDescripcion(request.getDescripcion());
        necesidad.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoNecesidad());
        necesidad.setTipoNecesidad(request.getTipoNecesidad());
        necesidad.setUrgencia(request.getUrgencia());
        necesidad.setUnidad(request.getUnidad());
        necesidad.setZona(request.getZona());
        necesidad.setCantidadRequerida(request.getCantidadRequerida());

        return toResponse(necesidadRepository.save(necesidad));
    }

    public NecesidadDTO.Response actualizarEstado(Long id, String estado) {
        Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
        necesidad.setEstado(Necesidad.EstadoNecesidad.valueOf(estado.toUpperCase()));
        return toResponse(necesidadRepository.save(necesidad));
    }

    private NecesidadDTO.Response toResponse(Necesidad n) {
        return NecesidadDTO.Response.builder()
                .id(n.getId())
                .beneficiarioNombre(n.getBeneficiario() != null ? n.getBeneficiario().getNombre() : "Anónimo")
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
