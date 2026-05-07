package com.donaton.backend.matching.service;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.model.Matching;
import com.donaton.backend.matching.repository.MatchingRepository;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchingRepository matchingRepository;
    private final DonacionRepository donacionRepository;
    private final NecesidadRepository necesidadRepository;

    public MatchingDTO.Response crear(MatchingDTO.CreateRequest request) {
        Donacion donacion = donacionRepository.findById(request.getDonacionId()).orElseThrow();
        Necesidad necesidad = necesidadRepository.findById(request.getNecesidadId()).orElseThrow();

        Matching matching = Matching.builder()
                .donacion(donacion)
                .necesidad(necesidad)
                .estado(Matching.EstadoMatching.PENDIENTE)
                .build();

        return toResponse(matchingRepository.save(matching));
    }

    public List<MatchingDTO.Response> listarPendientes() {
        return matchingRepository.findByEstado(Matching.EstadoMatching.PENDIENTE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MatchingDTO.Response actualizarEstado(Long id, String estado) {
        Matching matching = matchingRepository.findById(id).orElseThrow();
        matching.setEstado(Matching.EstadoMatching.valueOf(estado.toUpperCase()));
        return toResponse(matchingRepository.save(matching));
    }

    private MatchingDTO.Response toResponse(Matching m) {
        return MatchingDTO.Response.builder()
                .id(m.getId())
                .donacionId(m.getDonacion().getId())
                .necesidadId(m.getNecesidad().getId())
                .estado(m.getEstado().name())
                .fechaCreacion(m.getFechaCreacion())
                .build();
    }
}
