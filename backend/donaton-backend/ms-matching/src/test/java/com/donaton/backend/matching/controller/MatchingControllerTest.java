package com.donaton.backend.matching.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.service.MatchingService;
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
class MatchingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MatchingService matchingService;

    @InjectMocks
    private MatchingController matchingController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(matchingController).build();
    }

    @Test
    void crearShouldReturnMatchingResponse() throws Exception {
        MatchingDTO.CreateRequest request = new MatchingDTO.CreateRequest();
        request.setDonacionId(100L);
        request.setNecesidadId(100L);

        MatchingDTO.Response mockResponse = MatchingDTO.Response.builder()
                .id(501L)
                .donacionId(100L)
                .necesidadId(100L)
                .estado("PENDIENTE")
                .build();

        when(matchingService.crear(any(MatchingDTO.CreateRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/matching")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(501L))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }

    @Test
    void listarPendientesShouldReturnList() throws Exception {
        MatchingDTO.Response mockResponse = MatchingDTO.Response.builder()
                .id(501L)
                .estado("PENDIENTE")
                .build();

        when(matchingService.listarPendientes()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/matching/pendientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(501L));
    }

    @Test
    void listarResultadosShouldReturnList() throws Exception {
        MatchingDTO.Response mockResponse = MatchingDTO.Response.builder()
                .id(502L)
                .estado("ACEPTADA")
                .build();

        when(matchingService.listarResultados()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/matching/resultados"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(502L));
    }

    @Test
    void obtenerPorIdShouldReturnMatching() throws Exception {
        MatchingDTO.Response mockResponse = MatchingDTO.Response.builder()
                .id(502L)
                .estado("ACEPTADA")
                .build();

        when(matchingService.obtenerPorId(502L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/matching/resultados/502"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(502L));
    }

    @Test
    void actualizarEstadoShouldReturnUpdatedMatching() throws Exception {
        MatchingDTO.ActualizarEstadoRequest request = new MatchingDTO.ActualizarEstadoRequest();
        request.setEstado("ACEPTADA");

        MatchingDTO.Response mockResponse = MatchingDTO.Response.builder()
                .id(502L)
                .estado("ACEPTADA")
                .build();

        when(matchingService.actualizarEstado(eq(502L), eq("ACEPTADA"))).thenReturn(mockResponse);

        mockMvc.perform(patch("/api/matching/502/estado")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ACEPTADA"));
    }
}
