package com.donaton.backend.matching.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.model.Matching;
import com.donaton.backend.matching.repository.MatchingRepository;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;

class MatchingServiceTest {

    @Mock
    private MatchingRepository matchingRepository;
    @Mock
    private DonacionRepository donacionRepository;
    @Mock
    private NecesidadRepository necesidadRepository;

    @InjectMocks
    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearMatchingSuccess() {
        MatchingDTO.CreateRequest request = new MatchingDTO.CreateRequest();
        request.setDonacionId(10L);
        request.setNecesidadId(20L);

        Donacion donacion = Donacion.builder().id(10L).build();
        Necesidad necesidad = Necesidad.builder().id(20L).build();
        Matching matching = Matching.builder().id(88L).donacion(donacion).necesidad(necesidad).estado(Matching.EstadoMatching.PENDIENTE).build();

        when(donacionRepository.findById(10L)).thenReturn(Optional.of(donacion));
        when(necesidadRepository.findById(20L)).thenReturn(Optional.of(necesidad));
        when(matchingRepository.save(any(Matching.class))).thenReturn(matching);

        MatchingDTO.Response result = matchingService.crear(request);

        assertNotNull(result);
        assertEquals(88L, result.getId());
        assertEquals(10L, result.getDonacionId());
        assertEquals(20L, result.getNecesidadId());
        assertEquals("PENDIENTE", result.getEstado());
    }

    @Test
    void crearMatchingFallbackOnFailure() {
        MatchingDTO.CreateRequest request = new MatchingDTO.CreateRequest();
        request.setDonacionId(10L);
        request.setNecesidadId(20L);

        when(donacionRepository.findById(10L)).thenThrow(new RuntimeException("DB error"));

        MatchingDTO.Response result = matchingService.crear(request);

        assertNotNull(result);
        assertEquals("PENDIENTE", result.getEstado());
        assertEquals(10L, result.getDonacionId());
        assertEquals(20L, result.getNecesidadId());
    }

    @Test
    void listarPendientes() {
        Matching dbMatching = Matching.builder().id(999L).estado(Matching.EstadoMatching.PENDIENTE).build();
        when(matchingRepository.findByEstado(Matching.EstadoMatching.PENDIENTE)).thenReturn(List.of(dbMatching));

        List<MatchingDTO.Response> results = matchingService.listarPendientes();

        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(m -> m.getId().equals(999L)));
    }

    @Test
    void listarResultados() {
        Matching dbMatching = Matching.builder().id(999L).estado(Matching.EstadoMatching.ACEPTADA).build();
        when(matchingRepository.findAll()).thenReturn(List.of(dbMatching));

        List<MatchingDTO.Response> results = matchingService.listarResultados();

        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(m -> m.getId().equals(999L)));
    }

    @Test
    void obtenerPorIdFromDbAndFallback() {
        Matching dbMatching = Matching.builder().id(999L).build();
        when(matchingRepository.findById(999L)).thenReturn(Optional.of(dbMatching));

        MatchingDTO.Response result = matchingService.obtenerPorId(999L);
        assertEquals(999L, result.getId());

        MatchingDTO.Response mockResult = matchingService.obtenerPorId(501L);
        assertEquals(501L, mockResult.getId());

        assertThrows(RuntimeException.class, () -> matchingService.obtenerPorId(99999L));
    }

    @Test
    void actualizarEstado() {
        Matching dbMatching = Matching.builder().id(123L).estado(Matching.EstadoMatching.PENDIENTE).build();
        when(matchingRepository.findById(123L)).thenReturn(Optional.of(dbMatching));
        when(matchingRepository.save(any(Matching.class))).thenReturn(dbMatching);

        MatchingDTO.Response result = matchingService.actualizarEstado(123L, "ACEPTADA");
        assertEquals("ACEPTADA", result.getEstado());

        MatchingDTO.Response mockResult = matchingService.actualizarEstado(501L, "RECHAZADO");
        assertEquals("RECHAZADO", mockResult.getEstado());

        assertThrows(RuntimeException.class, () -> matchingService.actualizarEstado(9999L, "ACEPTADA"));
    }
}
