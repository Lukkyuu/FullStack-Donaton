package com.donaton.backend.auth.controller;

<<<<<<< HEAD
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
=======
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.service.AuthService;

class AuthControllerTest {
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

<<<<<<< HEAD
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
=======
    private SecurityContext originalContext;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        originalContext = SecurityContextHolder.getContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(originalContext);
    }

    @Test
    void loginShouldCallService() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        AuthDTO.AuthResponse response = new AuthDTO.AuthResponse("token", "email", "name", "role");
        when(authService.login(request)).thenReturn(response);

        ResponseEntity<AuthDTO.AuthResponse> result = authController.login(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void registerShouldCallService() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        AuthDTO.AuthResponse response = new AuthDTO.AuthResponse("token", "email", "name", "role");
        when(authService.register(request)).thenReturn(response);

        ResponseEntity<AuthDTO.AuthResponse> result = authController.register(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void logoutShouldReturnSuccessMessage() {
        ResponseEntity<?> result = authController.logout();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertTrue(result.getBody() instanceof AuthController.LogoutResponse);
        assertEquals("Sesión cerrada correctamente", ((AuthController.LogoutResponse) result.getBody()).message);
    }

    @Test
    void refreshShouldCallServiceWithEmailFromSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("context-email@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        AuthDTO.AuthResponse response = new AuthDTO.AuthResponse("new-token", "context-email@donaton.org", "name", "role");
        when(authService.refreshToken("context-email@donaton.org")).thenReturn(response);

        ResponseEntity<AuthDTO.AuthResponse> result = authController.refresh();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void meShouldCallServiceWithEmailFromSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("me-email@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        AuthDTO.AuthResponse response = new AuthDTO.AuthResponse("my-token", "me-email@donaton.org", "name", "role");
        when(authService.refreshToken("me-email@donaton.org")).thenReturn(response);

        ResponseEntity<AuthDTO.AuthResponse> result = authController.me();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void recuperarPasswordShouldCallService() {
        Map<String, String> request = Map.of("email", "recover@donaton.org");

        ResponseEntity<?> result = authController.recuperarPassword(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        verify(authService).recuperarPassword("recover@donaton.org");
    }

    @Test
    void resetPasswordShouldCallService() {
        Map<String, String> request = Map.of("token", "token-123", "newPassword", "new-pwd");

        ResponseEntity<?> result = authController.resetPassword(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        verify(authService).resetPassword("token-123", "new-pwd");
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
