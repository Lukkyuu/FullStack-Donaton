package com.donaton.backend.notificacion.controller;

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

import java.util.List;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
class NotificacionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificacionService notificacionService;

    @InjectMocks
    private NotificacionController notificacionController;

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
    }
}
