package com.donaton.backend.auth.controller;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.AuthResponse> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDTO.AuthResponse> register(@Valid @RequestBody AuthDTO.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(new LogoutResponse("Sesión cerrada correctamente"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDTO.AuthResponse> refresh() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(authService.refreshToken(email));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDTO.AuthResponse> me() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(authService.refreshToken(email));
    }

    public static class LogoutResponse {
        public String message;
        public LogoutResponse(String message) {
            this.message = message;
        }
    }
}
