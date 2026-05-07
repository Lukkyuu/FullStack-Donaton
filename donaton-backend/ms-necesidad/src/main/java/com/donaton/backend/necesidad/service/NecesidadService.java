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
                .categoria(request.getCategoria())
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

    public NecesidadDTO.Response actualizarEstado(Long id, String estado) {
        Necesidad necesidad = necesidadRepository.findById(id).orElseThrow();
        necesidad.setEstado(Necesidad.EstadoNecesidad.valueOf(estado.toUpperCase()));
        return toResponse(necesidadRepository.save(necesidad));
    }

    private NecesidadDTO.Response toResponse(Necesidad n) {
        return NecesidadDTO.Response.builder()
                .id(n.getId())
                .beneficiarioNombre(n.getBeneficiario().getNombre())
                .descripcion(n.getDescripcion())
                .categoria(n.getCategoria())
                .cantidadRequerida(n.getCantidadRequerida())
                .estado(n.getEstado() != null ? n.getEstado().name() : null)
                .fechaCreacion(n.getFechaCreacion())
                .build();
    }
}
