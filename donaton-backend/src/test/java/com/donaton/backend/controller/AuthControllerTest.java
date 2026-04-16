package com.donaton.backend.controller;

import com.donaton.backend.dto.AuthDTO;
import com.donaton.backend.security.JwtFilter;
import com.donaton.backend.security.JwtUtil;
import com.donaton.backend.security.UserDetailsServiceImpl;
import com.donaton.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private AuthService authService;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private UserDetailsServiceImpl userDetailsService;
    @MockitoBean private JwtFilter jwtFilter;

    @Test
    void login_credencialesValidas_retorna200ConToken() throws Exception {
        AuthDTO.AuthResponse response =
                new AuthDTO.AuthResponse("token123", "test@test.com", "Test", "DONANTE");
        when(authService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.LoginRequest("test@test.com", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"))
                .andExpect(jsonPath("$.email").value("test@test.com"))
                .andExpect(jsonPath("$.rol").value("DONANTE"));
    }

    @Test
    void login_credencialesInvalidas_retorna401() throws Exception {
        when(authService.login(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.LoginRequest("test@test.com", "wrongpass"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_emailInvalido_retorna400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.LoginRequest("no-es-email", "pass"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_datosValidos_retorna200ConToken() throws Exception {
        AuthDTO.AuthResponse response =
                new AuthDTO.AuthResponse("token123", "nuevo@test.com", "Nuevo", "DONANTE");
        when(authService.register(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.RegisterRequest("nuevo@test.com", "pass123", "Nuevo", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"));
    }

    @Test
    void register_emailDuplicado_retorna500() throws Exception {
        when(authService.register(any())).thenThrow(new RuntimeException("El email ya esta registrado"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.RegisterRequest("existe@test.com", "pass", "Test", null))))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void register_camposVacios_retorna400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthDTO.RegisterRequest("", "", "", null))))
                .andExpect(status().isBadRequest());
    }
}
