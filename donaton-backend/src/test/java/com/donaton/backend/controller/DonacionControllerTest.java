package com.donaton.backend.controller;

import com.donaton.backend.dto.DonacionDTO;
import com.donaton.backend.security.JwtFilter;
import com.donaton.backend.security.JwtUtil;
import com.donaton.backend.security.UserDetailsServiceImpl;
import com.donaton.backend.service.DonacionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DonacionController.class)
class DonacionControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private DonacionService donacionService;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private UserDetailsServiceImpl userDetailsService;
    @MockitoBean private JwtFilter jwtFilter;

    private DonacionDTO.Response donacionResponse() {
        return DonacionDTO.Response.builder()
                .id(1L).donanteNombre("Donante").centroAcopioNombre("Centro")
                .descripcion("Ropa").categoria("Vestimenta").cantidad(10)
                .estado("PENDIENTE").fechaCreacion(LocalDateTime.now()).build();
    }

    @Test
    @WithMockUser(roles = "DONANTE")
    void crear_autenticado_retorna200() throws Exception {
        when(donacionService.crear(any())).thenReturn(donacionResponse());

        mockMvc.perform(post("/api/donaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new DonacionDTO.Request(1L, "Ropa", "Vestimenta", 10))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descripcion").value("Ropa"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }

    @Test
    void crear_sinAutenticar_retorna401() throws Exception {
        mockMvc.perform(post("/api/donaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listarTodas_rolAdmin_retorna200() throws Exception {
        when(donacionService.listarTodas()).thenReturn(List.of(donacionResponse()));

        mockMvc.perform(get("/api/donaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(roles = "DONANTE")
    void listarTodas_rolDonante_retorna403() throws Exception {
        mockMvc.perform(get("/api/donaciones"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "DONANTE")
    void listarMisDonaciones_retorna200() throws Exception {
        when(donacionService.listarPorDonante()).thenReturn(List.of(donacionResponse()));

        mockMvc.perform(get("/api/donaciones/mis-donaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(roles = "LOGISTICA")
    void actualizarEstado_rolLogistica_retorna200() throws Exception {
        DonacionDTO.Response entregada = DonacionDTO.Response.builder()
                .id(1L).donanteNombre("Donante").descripcion("Ropa")
                .estado("ENTREGADA").fechaCreacion(LocalDateTime.now()).build();
        when(donacionService.actualizarEstado(eq(1L), eq("ENTREGADA"))).thenReturn(entregada);

        mockMvc.perform(patch("/api/donaciones/1/estado")
                        .param("estado", "ENTREGADA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ENTREGADA"));
    }
}
