package com.donaton.backend.notificacion.dto;

import lombok.*;
import java.time.LocalDateTime;

public class NotificacionDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String tipo;
        private String titulo;
        private String mensaje;
        private boolean leida;
        private LocalDateTime fechaCreacion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PreferenciasRequest {
        private boolean recibirEmails;
        private boolean recibirSMS;
        private boolean recibirNotificaciones;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PreferenciasResponse {
        private Long usuarioId;
        private boolean recibirEmails;
        private boolean recibirSMS;
        private boolean recibirNotificaciones;
    }
}
