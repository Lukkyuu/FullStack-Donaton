package com.donaton.backend.matching.dto;

import lombok.*;
import java.time.LocalDateTime;

public class MatchingDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long donacionId;
        private Long necesidadId;
        private String estado;
        private LocalDateTime fechaCreacion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private Long donacionId;
        private Long necesidadId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActualizarEstadoRequest {
        private String estado;
    }
}
