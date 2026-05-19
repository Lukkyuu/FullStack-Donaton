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
                .categoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion())
                .tipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria())
                .unidad(request.getUnidad())
                .zona(request.getZona())
                .necesidadId(request.getNecesidadId())
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

    public DonacionDTO.Response obtenerPorId(Long id) {
        Donacion donacion = donacionRepository.findById(id).orElseThrow();
        return toResponse(donacion);
    }

    public DonacionDTO.Response actualizar(Long id, DonacionDTO.Request request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario donante = usuarioRepository.findByEmail(email).orElseThrow();

        Donacion donacion = donacionRepository.findById(id).orElseThrow();
        
        if (!donacion.getDonante().getId().equals(donante.getId())) {
            throw new RuntimeException("No tienes permiso para editar esta donacion");
        }

        CentroAcopio centro = null;
        if (request.getCentroAcopioId() != null) {
            centro = centroAcopioRepository.findById(request.getCentroAcopioId()).orElseThrow();
        }

        donacion.setDescripcion(request.getDescripcion());
        donacion.setCategoria(request.getCategoria() != null ? request.getCategoria() : request.getTipoDonacion());
        donacion.setTipoDonacion(request.getTipoDonacion() != null ? request.getTipoDonacion() : request.getCategoria());
        donacion.setUnidad(request.getUnidad());
        donacion.setZona(request.getZona());
        donacion.setNecesidadId(request.getNecesidadId());
        donacion.setCantidad(request.getCantidad());
        donacion.setCentroAcopio(centro);

        return toResponse(donacionRepository.save(donacion));
    }

    public DonacionDTO.Response cancelar(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario donante = usuarioRepository.findByEmail(email).orElseThrow();

        Donacion donacion = donacionRepository.findById(id).orElseThrow();
        
        if (!donacion.getDonante().getId().equals(donante.getId())) {
            throw new RuntimeException("No tienes permiso para cancelar esta donacion");
        }

        donacion.setEstado(Donacion.EstadoDonacion.CANCELADA);
        return toResponse(donacionRepository.save(donacion));
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
