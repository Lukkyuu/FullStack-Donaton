package com.donaton.backend.necesidad.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.service.NecesidadService;
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
import java.util.Map;

@ExtendWith(MockitoExtension.class)
class NecesidadControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NecesidadService necesidadService;

    @InjectMocks
    private NecesidadController necesidadController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(necesidadController).build();
    }

    @Test
    void crearShouldReturnNeedResponse() throws Exception {
        NecesidadDTO.Request request = new NecesidadDTO.Request();
        request.setDescripcion("Frazadas abrigo");
        request.setCantidadRequerida(150);

        NecesidadDTO.Response mockResponse = NecesidadDTO.Response.builder()
                .id(201L)
                .descripcion("Frazadas abrigo")
                .cantidadRequerida(150)
                .estado("ACTIVA")
                .build();

        when(necesidadService.crear(any(NecesidadDTO.Request.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/necesidades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(201L))
                .andExpect(jsonPath("$.descripcion").value("Frazadas abrigo"));
    }

    @Test
    void listarActivasShouldReturnList() throws Exception {
        NecesidadDTO.Response mockResponse = NecesidadDTO.Response.builder()
                .id(1L)
                .descripcion("Agua potable")
                .estado("ACTIVA")
                .build();

        when(necesidadService.listarActivas()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/necesidades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void obtenerPorIdShouldReturnNeed() throws Exception {
        NecesidadDTO.Response mockResponse = NecesidadDTO.Response.builder()
                .id(1L)
                .descripcion("Agua potable")
                .estado("ACTIVA")
                .build();

        when(necesidadService.obtenerPorId(1L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/necesidades/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void actualizarEstadoShouldReturnUpdatedNeed() throws Exception {
        NecesidadDTO.Response mockResponse = NecesidadDTO.Response.builder()
                .id(1L)
                .estado("COMPLETADA")
                .build();

        when(necesidadService.actualizarEstado(1L, "COMPLETADA")).thenReturn(mockResponse);

        mockMvc.perform(patch("/api/necesidades/1/estado")
                        .param("estado", "COMPLETADA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("COMPLETADA"));
    }

    @Test
    void testDbShouldReturnReport() throws Exception {
        Map<String, Object> mockReport = Map.of(
                "status", "UP",
                "needsCount", 12L
        );

        when(necesidadService.testDatabaseConnection()).thenReturn(mockReport);

        mockMvc.perform(get("/api/necesidades/health/db"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.needsCount").value(12));
    }
}
