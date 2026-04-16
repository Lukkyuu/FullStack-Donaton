package com.donaton.backend.service;

import com.donaton.backend.dto.DonacionDTO;
import com.donaton.backend.messaging.DonacionPublisher;
import com.donaton.backend.model.CentroAcopio;
import com.donaton.backend.model.Donacion;
import com.donaton.backend.model.Usuario;
import com.donaton.backend.repository.CentroAcopioRepository;
import com.donaton.backend.repository.DonacionRepository;
import com.donaton.backend.repository.UsuarioRepository;
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

    public DonacionDTO.Response crear(DonacionDTO.Request request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario donante = usuarioRepository.findByEmail(email).orElseThrow();

        CentroAcopio centro = null;
        if (request.getCentroAcopioId() != null) {
            centro = centroAcopioRepository.findById(request.getCentroAcopioId()).orElseThrow();
        }

        Donacion donacion = Donacion.builder()
                .donante(donante)
                .centroAcopio(centro)
                .descripcion(request.getDescripcion())
                .categoria(request.getCategoria())
                .cantidad(request.getCantidad())
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        DonacionDTO.Response response = toResponse(donacionRepository.save(donacion));
        donacionPublisher.publicarDonacion(response);
        return response;
    }

    public List<DonacionDTO.Response> listarTodas() {
        return donacionRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DonacionDTO.Response> listarPorDonante() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario donante = usuarioRepository.findByEmail(email).orElseThrow();
        return donacionRepository.findByDonanteId(donante.getId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public DonacionDTO.Response actualizarEstado(Long id, String estado) {
        Donacion donacion = donacionRepository.findById(id).orElseThrow();
        donacion.setEstado(Donacion.EstadoDonacion.valueOf(estado.toUpperCase()));
        return toResponse(donacionRepository.save(donacion));
    }

    private DonacionDTO.Response toResponse(Donacion d) {
        return DonacionDTO.Response.builder()
                .id(d.getId())
                .donanteNombre(d.getDonante().getNombre())
                .centroAcopioNombre(d.getCentroAcopio() != null ? d.getCentroAcopio().getNombre() : null)
                .descripcion(d.getDescripcion())
                .categoria(d.getCategoria())
                .cantidad(d.getCantidad())
                .estado(d.getEstado() != null ? d.getEstado().name() : null)
                .fechaCreacion(d.getFechaCreacion())
                .build();
    }
}
