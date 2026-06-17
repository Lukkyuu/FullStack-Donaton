package com.donaton.backend.logistica.controller;

<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
=======
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.service.LogisticaService;
<<<<<<< HEAD
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

@ExtendWith(MockitoExtension.class)
class LogisticaControllerTest {

    private MockMvc mockMvc;

=======

class LogisticaControllerTest {

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private LogisticaService logisticaService;

    @InjectMocks
    private LogisticaController logisticaController;

<<<<<<< HEAD
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(logisticaController).build();
    }

    @Test
    void obtenerPendientesShouldReturnList() throws Exception {
        Donacion mockDonacion = Donacion.builder()
                .id(1L)
                .descripcion("Agua")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        when(logisticaService.obtenerDonacionesPendientes()).thenReturn(List.of(mockDonacion));

        mockMvc.perform(get("/api/logistica/donaciones/pendientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void asignarCentroShouldReturnUpdatedDonation() throws Exception {
        Donacion mockDonacion = Donacion.builder()
                .id(1L)
                .estado(Donacion.EstadoDonacion.EN_PROCESO)
                .build();

        when(logisticaService.asignarCentroAcopio(1L, 2L)).thenReturn(mockDonacion);

        mockMvc.perform(post("/api/logistica/donaciones/1/asignar/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.estado").value("EN_PROCESO"));
    }

    @Test
    void obtenerCentrosShouldReturnList() throws Exception {
        CentroAcopio mockCentro = CentroAcopio.builder()
                .id(10L)
                .nombre("Centro Santiago")
                .activo(true)
                .build();

        when(logisticaService.obtenerCentrosActivos()).thenReturn(List.of(mockCentro));

        mockMvc.perform(get("/api/logistica/centros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L));
    }

    @Test
    void marcarEntregadaShouldReturnUpdatedDonation() throws Exception {
        Donacion mockDonacion = Donacion.builder()
                .id(1L)
                .estado(Donacion.EstadoDonacion.ENTREGADA)
                .build();

        when(logisticaService.marcarEntregada(1L)).thenReturn(mockDonacion);

        mockMvc.perform(patch("/api/logistica/donaciones/1/entregar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ENTREGADA"));
    }

    @Test
    void crearRecursoShouldReturnRecurso() throws Exception {
        Recurso recurso = new Recurso(null, "Insumos", "MEDICAMENTO", 50.0, "cajas", "Santiago");
        Recurso mockRecurso = new Recurso(1L, "Insumos", "MEDICAMENTO", 50.0, "cajas", "Santiago");

        when(logisticaService.crearRecurso(any(Recurso.class))).thenReturn(mockRecurso);

        mockMvc.perform(post("/api/logistica/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recurso)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Insumos"));
    }

    @Test
    void crearDistribucionShouldReturnDistribucion() throws Exception {
        Distribucion dist = new Distribucion(null, 1L, 1L, 10.0, "cajas", "Destino", "Zona", "EN_TRANSITO");
        Distribucion mockDist = new Distribucion(5L, 1L, 1L, 10.0, "cajas", "Destino", "Zona", "EN_TRANSITO");

        when(logisticaService.crearDistribucion(any(Distribucion.class))).thenReturn(mockDist);

        mockMvc.perform(post("/api/logistica/distribuciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dist)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.estado").value("EN_TRANSITO"));
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
