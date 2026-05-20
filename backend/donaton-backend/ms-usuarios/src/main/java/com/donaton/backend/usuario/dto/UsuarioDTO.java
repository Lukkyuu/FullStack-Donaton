package com.donaton.backend.usuario.dto;

import lombok.*;
import java.time.LocalDateTime;

public class UsuarioDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String email;
        private String nombre;
        private String rol;
        private LocalDateTime fechaCreacion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PerfilResponse {
        private Long id;
        private String email;
        private String nombre;
        private String rol;
        private LocalDateTime fechaCreacion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActualizarPerfilRequest {
        private String nombre;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CambiarContraseñaRequest {
        private String contraseñaActual;
        private String contraseñaNueva;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CrearUsuarioRequest {
        private String nombre;
        private String email;
        private String password;
        private String role;
        private String zona;
        private String telefono;
    }
}
