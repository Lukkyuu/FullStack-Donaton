package com.donaton.backend.matching.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.service.MatchingService;

class MatchingControllerTest {

    @Mock
    private MatchingService matchingService;

    @InjectMocks
    private MatchingController matchingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crear() {
        MatchingDTO.CreateRequest request = new MatchingDTO.CreateRequest();
        MatchingDTO.Response response = new MatchingDTO.Response();
        when(matchingService.crear(request)).thenReturn(response);

        ResponseEntity<MatchingDTO.Response> result = matchingController.crear(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void listarPendientes() {
        List<MatchingDTO.Response> expected = List.of(new MatchingDTO.Response());
        when(matchingService.listarPendientes()).thenReturn(expected);

        ResponseEntity<List<MatchingDTO.Response>> result = matchingController.listarPendientes();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void listarResultados() {
        List<MatchingDTO.Response> expected = List.of(new MatchingDTO.Response());
        when(matchingService.listarResultados()).thenReturn(expected);

        ResponseEntity<List<MatchingDTO.Response>> result = matchingController.listarResultados();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerPorId() {
        MatchingDTO.Response response = new MatchingDTO.Response();
        when(matchingService.obtenerPorId(12L)).thenReturn(response);

        ResponseEntity<MatchingDTO.Response> result = matchingController.obtenerPorId(12L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizarEstado() {
        MatchingDTO.ActualizarEstadoRequest request = new MatchingDTO.ActualizarEstadoRequest();
        request.setEstado("APROBADO");
        MatchingDTO.Response response = new MatchingDTO.Response();
        when(matchingService.actualizarEstado(12L, "APROBADO")).thenReturn(response);

        ResponseEntity<MatchingDTO.Response> result = matchingController.actualizarEstado(12L, request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }
}
