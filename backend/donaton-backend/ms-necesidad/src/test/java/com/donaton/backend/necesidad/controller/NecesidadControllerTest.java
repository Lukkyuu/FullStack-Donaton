package com.donaton.backend.necesidad.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.service.NecesidadService;

class NecesidadControllerTest {

    @Mock
    private NecesidadService necesidadService;

    @InjectMocks
    private NecesidadController necesidadController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crear() {
        NecesidadDTO.Request request = new NecesidadDTO.Request();
        NecesidadDTO.Response response = new NecesidadDTO.Response();
        when(necesidadService.crear(request)).thenReturn(response);

        ResponseEntity<NecesidadDTO.Response> result = necesidadController.crear(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void listarActivas() {
        List<NecesidadDTO.Response> list = List.of(new NecesidadDTO.Response());
        when(necesidadService.listarActivas()).thenReturn(list);

        ResponseEntity<List<NecesidadDTO.Response>> result = necesidadController.listarActivas();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(list, result.getBody());
    }

    @Test
    void listarMias() {
        List<NecesidadDTO.Response> list = List.of(new NecesidadDTO.Response());
        when(necesidadService.listarPorBeneficiario()).thenReturn(list);

        ResponseEntity<List<NecesidadDTO.Response>> result = necesidadController.listarMias();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(list, result.getBody());
    }

    @Test
    void listarPublicas() {
        List<NecesidadDTO.Response> list = List.of(new NecesidadDTO.Response());
        when(necesidadService.listarPublicas()).thenReturn(list);

        ResponseEntity<List<NecesidadDTO.Response>> result = necesidadController.listarPublicas();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(list, result.getBody());
    }

    @Test
    void obtenerPorId() {
        NecesidadDTO.Response response = new NecesidadDTO.Response();
        when(necesidadService.obtenerPorId(12L)).thenReturn(response);

        ResponseEntity<NecesidadDTO.Response> result = necesidadController.obtenerPorId(12L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizar() {
        NecesidadDTO.Request request = new NecesidadDTO.Request();
        NecesidadDTO.Response response = new NecesidadDTO.Response();
        when(necesidadService.actualizar(12L, request)).thenReturn(response);

        ResponseEntity<NecesidadDTO.Response> result = necesidadController.actualizar(12L, request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizarEstado() {
        NecesidadDTO.Response response = new NecesidadDTO.Response();
        when(necesidadService.actualizarEstado(12L, "COMPLETADA")).thenReturn(response);

        ResponseEntity<NecesidadDTO.Response> result = necesidadController.actualizarEstado(12L, "COMPLETADA");

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void testDbConnectionReport() {
        Map<String, Object> expected = Map.of("status", "UP");
        when(necesidadService.testDatabaseConnection()).thenReturn(expected);

        ResponseEntity<Map<String, Object>> result = necesidadController.testDb();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }
}
