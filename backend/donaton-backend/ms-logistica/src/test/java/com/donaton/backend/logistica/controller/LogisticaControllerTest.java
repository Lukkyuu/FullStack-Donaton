package com.donaton.backend.logistica.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.service.LogisticaService;

class LogisticaControllerTest {

    @Mock
    private LogisticaService logisticaService;

    @InjectMocks
    private LogisticaController logisticaController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerPendientes() {
        List<Donacion> expected = List.of(new Donacion());
        when(logisticaService.obtenerDonacionesPendientes()).thenReturn(expected);

        ResponseEntity<List<Donacion>> result = logisticaController.obtenerPendientes();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void asignarCentro() {
        Donacion expected = new Donacion();
        when(logisticaService.asignarCentroAcopio(1L, 2L)).thenReturn(expected);

        ResponseEntity<Donacion> result = logisticaController.asignarCentro(1L, 2L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerCentros() {
        List<CentroAcopio> expected = List.of(new CentroAcopio());
        when(logisticaService.obtenerCentrosActivos()).thenReturn(expected);

        ResponseEntity<List<CentroAcopio>> result = logisticaController.obtenerCentros();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void marcarEntregada() {
        Donacion expected = new Donacion();
        when(logisticaService.marcarEntregada(1L)).thenReturn(expected);

        ResponseEntity<Donacion> result = logisticaController.marcarEntregada(1L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerRecursos() {
        List<Recurso> expected = List.of(new Recurso());
        when(logisticaService.obtenerRecursos()).thenReturn(expected);

        ResponseEntity<List<Recurso>> result = logisticaController.obtenerRecursos();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerRecursoPorId() {
        Recurso expected = new Recurso();
        when(logisticaService.obtenerRecursoPorId(1L)).thenReturn(expected);

        ResponseEntity<Recurso> result = logisticaController.obtenerRecursoPorId(1L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());

        when(logisticaService.obtenerRecursoPorId(2L)).thenReturn(null);
        ResponseEntity<Recurso> notFound = logisticaController.obtenerRecursoPorId(2L);
        assertEquals(404, notFound.getStatusCode().value());
    }

    @Test
    void crearRecurso() {
        Recurso input = new Recurso();
        Recurso expected = new Recurso();
        when(logisticaService.crearRecurso(input)).thenReturn(expected);

        ResponseEntity<Recurso> result = logisticaController.crearRecurso(input);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerDistribuciones() {
        List<Distribucion> expected = List.of(new Distribucion());
        when(logisticaService.obtenerDistribuciones()).thenReturn(expected);

        ResponseEntity<List<Distribucion>> result = logisticaController.obtenerDistribuciones();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerDistribucionPorId() {
        Distribucion expected = new Distribucion();
        when(logisticaService.obtenerDistribucionPorId(1L)).thenReturn(expected);

        ResponseEntity<Distribucion> result = logisticaController.obtenerDistribucionPorId(1L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());

        when(logisticaService.obtenerDistribucionPorId(2L)).thenReturn(null);
        ResponseEntity<Distribucion> notFound = logisticaController.obtenerDistribucionPorId(2L);
        assertEquals(404, notFound.getStatusCode().value());
    }

    @Test
    void crearDistribucion() {
        Distribucion input = new Distribucion();
        Distribucion expected = new Distribucion();
        when(logisticaService.crearDistribucion(input)).thenReturn(expected);

        ResponseEntity<Distribucion> result = logisticaController.crearDistribucion(input);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }
}
