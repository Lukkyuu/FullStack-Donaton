package com.donaton.backend.necesidad.controller;

<<<<<<< HEAD
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
=======
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

import java.util.List;
import java.util.Map;

<<<<<<< HEAD
@ExtendWith(MockitoExtension.class)
class NecesidadControllerTest {

    private MockMvc mockMvc;
=======
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.service.NecesidadService;

class NecesidadControllerTest {
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

    @Mock
    private NecesidadService necesidadService;

    @InjectMocks
    private NecesidadController necesidadController;

<<<<<<< HEAD
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
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
