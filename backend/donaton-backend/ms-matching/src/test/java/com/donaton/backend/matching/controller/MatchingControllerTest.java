package com.donaton.backend.matching.controller;

<<<<<<< HEAD
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

import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.service.MatchingService;

class MatchingControllerTest {
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

    @Mock
    private MatchingService matchingService;

    @InjectMocks
    private MatchingController matchingController;

<<<<<<< HEAD
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
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
