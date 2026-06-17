package com.donaton.backend.notificacion.controller;

<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.service.NotificacionService;
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
class NotificacionControllerTest {

    private MockMvc mockMvc;
=======
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.service.NotificacionService;

class NotificacionControllerTest {
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

    @Mock
    private NotificacionService notificacionService;

    @InjectMocks
    private NotificacionController notificacionController;

<<<<<<< HEAD
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(notificacionController).build();
    }

    @Test
    void obtenerMisNotificacionesShouldReturnList() throws Exception {
        NotificacionDTO.Response response = NotificacionDTO.Response.builder()
                .id(1L)
                .titulo("Aviso")
                .leida(false)
                .build();

        when(notificacionService.obtenerMisNotificaciones()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/notificaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].titulo").value("Aviso"));
    }

    @Test
    void obtenerNoLeidasShouldReturnList() throws Exception {
        NotificacionDTO.Response response = NotificacionDTO.Response.builder()
                .id(2L)
                .titulo("Alerta")
                .leida(false)
                .build();

        when(notificacionService.obtenerNoLeidas()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/notificaciones/no-leidas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L));
    }

    @Test
    void obtenerMisPreferenciasShouldReturnMap() throws Exception {
        Map<String, Object> mockPrefs = Map.of(
                "canales", Map.of("email", true, "push", false)
        );

        when(notificacionService.obtenerMisPreferenciasMap()).thenReturn(mockPrefs);

        mockMvc.perform(get("/api/notificaciones/preferencias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canales.email").value(true));
    }

    @Test
    void guardarMisPreferenciasShouldCallService() throws Exception {
        Map<String, Object> request = Map.of(
                "canales", Map.of("email", true)
        );

        mockMvc.perform(put("/api/notificaciones/preferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canales.email").value(true));

        verify(notificacionService).guardarMisPreferenciasMap(any(Map.class));
    }

    @Test
    void establecerPreferenciasShouldReturnResponse() throws Exception {
        NotificacionDTO.PreferenciasRequest request = new NotificacionDTO.PreferenciasRequest();
        request.setRecibirEmails(true);
        request.setRecibirSMS(false);

        NotificacionDTO.PreferenciasResponse response = NotificacionDTO.PreferenciasResponse.builder()
                .usuarioId(10L)
                .recibirEmails(true)
                .recibirSMS(false)
                .build();

        when(notificacionService.obtenerPreferencias(10L)).thenReturn(response);

        mockMvc.perform(put("/api/notificaciones/preferencias/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioId").value(10L))
                .andExpect(jsonPath("$.recibirEmails").value(true))
                .andExpect(jsonPath("$.recibirSMS").value(false));

        verify(notificacionService).establecerPreferencias(eq(10L), any(NotificacionDTO.PreferenciasRequest.class));
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
