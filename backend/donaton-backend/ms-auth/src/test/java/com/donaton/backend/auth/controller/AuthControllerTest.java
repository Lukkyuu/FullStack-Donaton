package com.donaton.backend.auth.controller;

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

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

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
    }
}
