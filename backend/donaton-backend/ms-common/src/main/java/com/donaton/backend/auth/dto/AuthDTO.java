package com.donaton.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres")
        private String password;

        @NotBlank
        private String nombre;

        private String rol;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String nombre;
        private String rol;
    }
}
