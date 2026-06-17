package com.donaton.backend.matching.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.model.Matching;
import com.donaton.backend.matching.repository.MatchingRepository;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private MatchingRepository matchingRepository;

    @Mock
    private DonacionRepository donacionRepository;

    @Mock
    private NecesidadRepository necesidadRepository;

    @InjectMocks
    private MatchingService matchingService;

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
    }
}
