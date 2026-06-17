package com.donaton.backend.donacion.controller;

<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.service.DonacionService;
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
class DonacionControllerTest {

    private MockMvc mockMvc;

=======
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.service.DonacionService;

class DonacionControllerTest {

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private DonacionService donacionService;

    @InjectMocks
    private DonacionController donacionController;

<<<<<<< HEAD
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(donacionController).build();
    }

    @Test
    void crearShouldReturnDonationResponse() throws Exception {
        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setDescripcion("Caja de ropa");
        request.setCantidad(2);

        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(101L)
                .descripcion("Caja de ropa")
                .cantidad(2)
                .estado("PENDIENTE")
                .build();

        when(donacionService.crear(any(DonacionDTO.Request.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/donaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101L))
                .andExpect(jsonPath("$.descripcion").value("Caja de ropa"));
    }

    @Test
    void listarTodasShouldReturnList() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .descripcion("Alimento")
                .estado("PENDIENTE")
                .build();

        when(donacionService.listarTodas()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/donaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void obtenerPorIdShouldReturnDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .descripcion("Alimento")
                .estado("PENDIENTE")
                .build();

        when(donacionService.obtenerPorId(1L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/donaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void actualizarEstadoShouldReturnUpdatedDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .estado("ENTREGADA")
                .build();

        when(donacionService.actualizarEstado(1L, "ENTREGADA")).thenReturn(mockResponse);

        mockMvc.perform(patch("/api/donaciones/1/estado")
                        .param("estado", "ENTREGADA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ENTREGADA"));
    }

    @Test
    void cancelarShouldCancelDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .estado("CANCELADA")
                .build();

        when(donacionService.cancelar(1L)).thenReturn(mockResponse);

        mockMvc.perform(post("/api/donaciones/1/cancelar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADA"));
    }

    @Test
    void listarCampanasShouldReturnDefaultCampaigns() throws Exception {
        mockMvc.perform(get("/api/donaciones/campanas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].titulo").value("Campaña de Invierno ❄"));
=======
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearDonacion() {
        DonacionDTO.Request request = new DonacionDTO.Request();
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.crear(request)).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> result = donacionController.crear(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void listarTodas() {
        List<DonacionDTO.Response> list = List.of(new DonacionDTO.Response());
        when(donacionService.listarTodas()).thenReturn(list);

        ResponseEntity<List<DonacionDTO.Response>> result = donacionController.listarTodas();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(list, result.getBody());
    }

    @Test
    void listarMias() {
        List<DonacionDTO.Response> list = List.of(new DonacionDTO.Response());
        when(donacionService.listarPorDonante()).thenReturn(list);

        ResponseEntity<List<DonacionDTO.Response>> result = donacionController.listarMias();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(list, result.getBody());
    }

    @Test
    void obtenerPorId() {
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.obtenerPorId(12L)).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> result = donacionController.obtenerPorId(12L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizarDonacion() {
        DonacionDTO.Request request = new DonacionDTO.Request();
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.actualizar(12L, request)).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> result = donacionController.actualizar(12L, request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizarDonacionWithStatusChange() {
        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setEstado("COMPLETADA");
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.actualizar(12L, request)).thenReturn(response);
        when(donacionService.actualizarEstado(12L, "COMPLETADA")).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> result = donacionController.actualizar(12L, request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        verify(donacionService).actualizarEstado(12L, "COMPLETADA");
    }

    @Test
    void cancelarAndCancelarPatch() {
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.cancelar(12L)).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> res1 = donacionController.cancelar(12L);
        ResponseEntity<DonacionDTO.Response> res2 = donacionController.cancelarPatch(12L);

        assertNotNull(res1);
        assertEquals(200, res1.getStatusCode().value());
        assertEquals(response, res1.getBody());

        assertNotNull(res2);
        assertEquals(200, res2.getStatusCode().value());
        assertEquals(response, res2.getBody());
    }

    @Test
    void actualizarEstado() {
        DonacionDTO.Response response = new DonacionDTO.Response();
        when(donacionService.actualizarEstado(12L, "RECHAZADA")).thenReturn(response);

        ResponseEntity<DonacionDTO.Response> result = donacionController.actualizarEstado(12L, "RECHAZADA");

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void listarCampanasAndObtenerCampana() {
        ResponseEntity<List<Map<String, Object>>> listResult = donacionController.listarCampanas();
        assertNotNull(listResult);
        assertEquals(200, listResult.getStatusCode().value());
        assertEquals(3, listResult.getBody().size());

        ResponseEntity<Map<String, Object>> singleResult = donacionController.obtenerCampana(2L);
        assertNotNull(singleResult);
        assertEquals(200, singleResult.getStatusCode().value());
        assertEquals("Reconstrucción Biobío 🏠", singleResult.getBody().get("titulo"));

        ResponseEntity<Map<String, Object>> notFoundResult = donacionController.obtenerCampana(99L);
        assertEquals(404, notFoundResult.getStatusCode().value());
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
