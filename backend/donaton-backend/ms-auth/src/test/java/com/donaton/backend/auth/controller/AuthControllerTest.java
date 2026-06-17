package com.donaton.backend.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.service.AuthService;
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

import java.util.Map;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void loginShouldReturnAuthResponse() throws Exception {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("user@donaton.org");
        request.setPassword("password123");

        AuthDTO.AuthResponse mockResponse = new AuthDTO.AuthResponse(
                "token_123", "user@donaton.org", "User Name", "DONANTE"
        );

        when(authService.login(any(AuthDTO.LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token_123"))
                .andExpect(jsonPath("$.email").value("user@donaton.org"))
                .andExpect(jsonPath("$.nombre").value("User Name"))
                .andExpect(jsonPath("$.rol").value("DONANTE"));
    }

    @Test
    void registerShouldReturnAuthResponse() throws Exception {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("new@donaton.org");
        request.setPassword("password123");
        request.setNombre("New User");
        request.setRol("DONANTE");

        AuthDTO.AuthResponse mockResponse = new AuthDTO.AuthResponse(
                "token_new", "new@donaton.org", "New User", "DONANTE"
        );

        when(authService.register(any(AuthDTO.RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token_new"))
                .andExpect(jsonPath("$.email").value("new@donaton.org"));
    }

    @Test
    void logoutShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Sesión cerrada correctamente"));
    }

    @Test
    void recuperarPasswordShouldTriggerServiceFlow() throws Exception {
        Map<String, String> requestBody = Map.of("email", "test@donaton.org");

        mockMvc.perform(post("/api/auth/recuperar-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Si el correo existe, se ha enviado un enlace de recuperación."));

        verify(authService).recuperarPassword("test@donaton.org");
    }

    @Test
    void resetPasswordShouldTriggerServiceFlow() throws Exception {
        Map<String, String> requestBody = Map.of(
                "token", "valid_token",
                "newPassword", "newSecret"
        );

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contraseña restablecida exitosamente."));

        verify(authService).resetPassword("valid_token", "newSecret");
    }
}
