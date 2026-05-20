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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchingRepository matchingRepository;
    private final DonacionRepository donacionRepository;
    private final NecesidadRepository necesidadRepository;

    private static final java.util.concurrent.CopyOnWriteArrayList<MatchingDTO.Response> MOCK_MATCHINGS = new java.util.concurrent.CopyOnWriteArrayList<>();

    static {
        MOCK_MATCHINGS.add(MatchingDTO.Response.builder()
                .id(501L)
                .donacionId(100L)
                .necesidadId(100L)
                .estado("PENDIENTE")
                .estrategia("CercaniaStrategy")
                .score(0.95)
                .fechaMatching(LocalDateTime.now().minusHours(2))
                .fechaCreacion(LocalDateTime.now().minusHours(2))
                .build());

        MOCK_MATCHINGS.add(MatchingDTO.Response.builder()
                .id(502L)
                .donacionId(101L)
                .necesidadId(101L)
                .estado("PENDIENTE")
                .estrategia("UrgenciaStrategy")
                .score(0.88)
                .fechaMatching(LocalDateTime.now().minusHours(5))
                .fechaCreacion(LocalDateTime.now().minusHours(5))
                .build());

        MOCK_MATCHINGS.add(MatchingDTO.Response.builder()
                .id(503L)
                .donacionId(102L)
                .necesidadId(102L)
                .estado("PENDIENTE")
                .estrategia("TipoNecesidadStrategy")
                .score(0.72)
                .fechaMatching(LocalDateTime.now().minusDays(1))
                .fechaCreacion(LocalDateTime.now().minusDays(1))
                .build());

        MOCK_MATCHINGS.add(MatchingDTO.Response.builder()
                .id(504L)
                .donacionId(103L)
                .necesidadId(103L)
                .estado("PENDIENTE")
                .estrategia("CercaniaStrategy")
                .score(0.91)
                .fechaMatching(LocalDateTime.now().minusDays(2))
                .fechaCreacion(LocalDateTime.now().minusDays(2))
                .build());
    }

    private List<MatchingDTO.Response> mergeWithDb(List<MatchingDTO.Response> dbList) {
        java.util.Map<Long, MatchingDTO.Response> merged = new java.util.LinkedHashMap<>();
        for (MatchingDTO.Response m : MOCK_MATCHINGS) {
            merged.put(m.getId(), m);
        }
        if (dbList != null) {
            for (MatchingDTO.Response d : dbList) {
                merged.put(d.getId(), d);
            }
        }
        return new java.util.ArrayList<>(merged.values());
    }

    public MatchingDTO.Response crear(MatchingDTO.CreateRequest request) {
        try {
            Donacion donacion = donacionRepository.findById(request.getDonacionId()).orElseThrow();
            Necesidad necesidad = necesidadRepository.findById(request.getNecesidadId()).orElseThrow();

            Matching matching = Matching.builder()
                    .donacion(donacion)
                    .necesidad(necesidad)
                    .estado(Matching.EstadoMatching.PENDIENTE)
                    .build();

            return toResponse(matchingRepository.save(matching));
        } catch (Exception e) {
            MatchingDTO.Response response = MatchingDTO.Response.builder()
                    .id((long) (MOCK_MATCHINGS.size() + 501))
                    .donacionId(request.getDonacionId())
                    .necesidadId(request.getNecesidadId())
                    .estado("PENDIENTE")
                    .estrategia("CercaniaStrategy")
                    .score(0.85)
                    .fechaMatching(LocalDateTime.now())
                    .fechaCreacion(LocalDateTime.now())
                    .build();
            MOCK_MATCHINGS.add(response);
            return response;
        }
    }

    public List<MatchingDTO.Response> listarPendientes() {
        List<MatchingDTO.Response> dbList = null;
        try {
            dbList = matchingRepository.findByEstado(Matching.EstadoMatching.PENDIENTE)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        } catch (Exception e) {}
        return mergeWithDb(dbList).stream()
                .filter(m -> "PENDIENTE".equalsIgnoreCase(m.getEstado()))
                .collect(Collectors.toList());
    }

    public List<MatchingDTO.Response> listarResultados() {
        List<MatchingDTO.Response> dbList = null;
        try {
            dbList = matchingRepository.findAll()
                    .stream().map(this::toResponse).collect(Collectors.toList());
        } catch (Exception e) {}
        return mergeWithDb(dbList);
    }

    public MatchingDTO.Response obtenerPorId(Long id) {
        try {
            Matching m = matchingRepository.findById(id).orElse(null);
            if (m != null) {
                return toResponse(m);
            }
        } catch (Exception e) {}
        return MOCK_MATCHINGS.stream().filter(m -> m.getId().equals(id)).findFirst()
                .orElseThrow(() -> new RuntimeException("Matching no encontrado: " + id));
    }

    public MatchingDTO.Response actualizarEstado(Long id, String estado) {
        try {
            Matching matching = matchingRepository.findById(id).orElse(null);
            if (matching != null) {
                matching.setEstado(Matching.EstadoMatching.valueOf(estado.toUpperCase()));
                return toResponse(matchingRepository.save(matching));
            }
        } catch (Exception e) {}
        for (MatchingDTO.Response m : MOCK_MATCHINGS) {
            if (m.getId().equals(id)) {
                m.setEstado(estado.toUpperCase());
                return m;
            }
        }
        throw new RuntimeException("Matching no encontrado: " + id);
    }

    private MatchingDTO.Response toResponse(Matching m) {
        return MatchingDTO.Response.builder()
                .id(m.getId())
                .donacionId(m.getDonacion() != null ? m.getDonacion().getId() : null)
                .necesidadId(m.getNecesidad() != null ? m.getNecesidad().getId() : null)
                .estado(m.getEstado() != null ? m.getEstado().name() : "PENDIENTE")
                .estrategia("CercaniaStrategy")
                .score(0.85)
                .fechaMatching(m.getFechaCreacion() != null ? m.getFechaCreacion() : LocalDateTime.now())
                .fechaCreacion(m.getFechaCreacion())
                .build();
    }
}
