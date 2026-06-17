package com.donaton.backend.matching.service;

import static org.junit.jupiter.api.Assertions.*;
<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

=======
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.model.Matching;
import com.donaton.backend.matching.repository.MatchingRepository;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
<<<<<<< HEAD
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
=======

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
class MatchingServiceTest {

    @Mock
    private MatchingRepository matchingRepository;
<<<<<<< HEAD

    @Mock
    private DonacionRepository donacionRepository;

=======
    @Mock
    private DonacionRepository donacionRepository;
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private NecesidadRepository necesidadRepository;

    @InjectMocks
    private MatchingService matchingService;

<<<<<<< HEAD
    private Donacion mockDonacion;
    private Necesidad mockNecesidad;
    private Matching mockMatching;

    @BeforeEach
    void setUp() {
        mockDonacion = Donacion.builder().id(100L).descripcion("Alimento").build();
        mockNecesidad = Necesidad.builder().id(100L).descripcion("Necesidad Alimento").build();
        mockMatching = Matching.builder()
                .id(502L)
                .donacion(mockDonacion)
                .necesidad(mockNecesidad)
                .estado(Matching.EstadoMatching.PENDIENTE)
                .build();
    }

    @Test
    void crearShouldSaveAndReturnResponse() {
        when(donacionRepository.findById(100L)).thenReturn(Optional.of(mockDonacion));
        when(necesidadRepository.findById(100L)).thenReturn(Optional.of(mockNecesidad));
        when(matchingRepository.save(any(Matching.class))).thenReturn(mockMatching);

        MatchingDTO.CreateRequest request = new MatchingDTO.CreateRequest();
        request.setDonacionId(100L);
        request.setNecesidadId(100L);

        MatchingDTO.Response response = matchingService.crear(request);

        assertNotNull(response);
        assertEquals("PENDIENTE", response.getEstado());
        assertEquals(100L, response.getDonacionId());
        assertEquals(100L, response.getNecesidadId());
        verify(matchingRepository).save(any(Matching.class));
    }

    @Test
    void listarPendientesShouldReturnPendientesOnly() {
        when(matchingRepository.findByEstado(Matching.EstadoMatching.PENDIENTE)).thenReturn(List.of(mockMatching));

        List<MatchingDTO.Response> list = matchingService.listarPendientes();

        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertTrue(list.stream().anyMatch(m -> "PENDIENTE".equals(m.getEstado())));
    }

    @Test
    void obtenerPorIdShouldReturnMatching() {
        when(matchingRepository.findById(502L)).thenReturn(Optional.of(mockMatching));

        MatchingDTO.Response response = matchingService.obtenerPorId(502L);

        assertNotNull(response);
        assertEquals(502L, response.getId());
    }

    @Test
    void actualizarEstadoShouldSaveWithNewState() {
        when(matchingRepository.findById(502L)).thenReturn(Optional.of(mockMatching));
        when(matchingRepository.save(any(Matching.class))).thenAnswer(i -> i.getArguments()[0]);

        MatchingDTO.Response response = matchingService.actualizarEstado(502L, "ACEPTADA");

        assertNotNull(response);
        assertEquals("ACEPTADA", response.getEstado());
        verify(matchingRepository).save(mockMatching);
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
