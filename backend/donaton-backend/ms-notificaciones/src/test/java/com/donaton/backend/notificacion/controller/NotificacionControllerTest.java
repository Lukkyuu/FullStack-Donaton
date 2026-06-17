package com.donaton.backend.notificacion.controller;

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

import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.service.NotificacionService;

class NotificacionControllerTest {

    @Mock
    private NotificacionService notificacionService;

    @InjectMocks
    private NotificacionController notificacionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerMisNotificaciones() {
        List<NotificacionDTO.Response> expected = List.of(new NotificacionDTO.Response());
        when(notificacionService.obtenerMisNotificaciones()).thenReturn(expected);

        ResponseEntity<List<NotificacionDTO.Response>> result = notificacionController.obtenerMisNotificaciones();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerNoLeidas() {
        List<NotificacionDTO.Response> expected = List.of(new NotificacionDTO.Response());
        when(notificacionService.obtenerNoLeidas()).thenReturn(expected);

        ResponseEntity<List<NotificacionDTO.Response>> result = notificacionController.obtenerNoLeidas();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void obtenerMisPreferencias() {
        Map<String, Object> expected = Map.of("key", "value");
        when(notificacionService.obtenerMisPreferenciasMap()).thenReturn(expected);

        ResponseEntity<Map<String, Object>> result = notificacionController.obtenerMisPreferencias();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void guardarMisPreferencias() {
        Map<String, Object> body = Map.of("key", "value");

        ResponseEntity<Map<String, Object>> result = notificacionController.guardarMisPreferencias(body);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(body, result.getBody());
        verify(notificacionService).guardarMisPreferenciasMap(body);
    }

    @Test
    void establecerPreferencias() {
        NotificacionDTO.PreferenciasRequest request = new NotificacionDTO.PreferenciasRequest();
        NotificacionDTO.PreferenciasResponse response = new NotificacionDTO.PreferenciasResponse();
        when(notificacionService.obtenerPreferencias(99L)).thenReturn(response);

        ResponseEntity<NotificacionDTO.PreferenciasResponse> result = notificacionController.establecerPreferencias(99L, request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
        verify(notificacionService).establecerPreferencias(99L, request);
    }

    @Test
    void obtenerPreferencias() {
        NotificacionDTO.PreferenciasResponse response = new NotificacionDTO.PreferenciasResponse();
        when(notificacionService.obtenerPreferencias(99L)).thenReturn(response);

        ResponseEntity<NotificacionDTO.PreferenciasResponse> result = notificacionController.obtenerPreferencias(99L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }
}
