package com.donaton.backend.donacion.controller;

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

    @Mock
    private DonacionService donacionService;

    @InjectMocks
    private DonacionController donacionController;

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
    }
}
