package com.donaton.backend.controller;

import com.donaton.backend.dto.NecesidadDTO;
import com.donaton.backend.security.JwtFilter;
import com.donaton.backend.security.JwtUtil;
import com.donaton.backend.security.UserDetailsServiceImpl;
import com.donaton.backend.service.NecesidadService;
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

@WebMvcTest(NecesidadController.class)
class NecesidadControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private NecesidadService necesidadService;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private UserDetailsServiceImpl userDetailsService;
    @MockitoBean private JwtFilter jwtFilter;

    private NecesidadDTO.Response necesidadResponse() {
        return NecesidadDTO.Response.builder()
                .id(1L).beneficiarioNombre("Beneficiario")
                .descripcion("Necesito ropa").categoria("Vestimenta")
                .cantidadRequerida(3).estado("ACTIVA")
                .fechaCreacion(LocalDateTime.now()).build();
    }

    @Test
    @WithMockUser(roles = "BENEFICIARIO")
    void crear_autenticado_retorna200() throws Exception {
        when(necesidadService.crear(any())).thenReturn(necesidadResponse());

        mockMvc.perform(post("/api/necesidades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new NecesidadDTO.Request("Necesito ropa", "Vestimenta", 3))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descripcion").value("Necesito ropa"))
                .andExpect(jsonPath("$.estado").value("ACTIVA"));
    }

    @Test
    void crear_sinAutenticar_retorna401() throws Exception {
        mockMvc.perform(post("/api/necesidades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "DONANTE")
    void listarActivas_cualquierUsuario_retorna200() throws Exception {
        when(necesidadService.listarActivas()).thenReturn(List.of(necesidadResponse()));

        mockMvc.perform(get("/api/necesidades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(roles = "BENEFICIARIO")
    void listarMisNecesidades_retorna200() throws Exception {
        when(necesidadService.listarPorBeneficiario()).thenReturn(List.of(necesidadResponse()));

        mockMvc.perform(get("/api/necesidades/mis-necesidades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarEstado_rolAdmin_retorna200() throws Exception {
        NecesidadDTO.Response satisfecha = NecesidadDTO.Response.builder()
                .id(1L).beneficiarioNombre("Beneficiario")
                .descripcion("Necesito ropa").estado("SATISFECHA")
                .fechaCreacion(LocalDateTime.now()).build();
        when(necesidadService.actualizarEstado(eq(1L), eq("SATISFECHA"))).thenReturn(satisfecha);

        mockMvc.perform(patch("/api/necesidades/1/estado")
                        .param("estado", "SATISFECHA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("SATISFECHA"));
    }

    @Test
    @WithMockUser(roles = "DONANTE")
    void actualizarEstado_rolDonante_retorna403() throws Exception {
        mockMvc.perform(patch("/api/necesidades/1/estado")
                        .param("estado", "SATISFECHA"))
                .andExpect(status().isForbidden());
    }
}
