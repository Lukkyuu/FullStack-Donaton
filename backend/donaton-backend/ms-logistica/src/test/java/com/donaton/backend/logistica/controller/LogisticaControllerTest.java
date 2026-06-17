package com.donaton.backend.logistica.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.service.LogisticaService;
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

    @Mock
    private LogisticaService logisticaService;

    @InjectMocks
    private LogisticaController logisticaController;

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
    }
}
