package com.donaton.backend.necesidad.dto;

import lombok.*;
import java.time.LocalDateTime;

public class NecesidadDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String descripcion;
        private String categoria;
        private String tipoNecesidad;
        private String urgencia;
        private String unidad;
        private String zona;
        private Integer cantidadRequerida;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String beneficiarioNombre;
        private String descripcion;
        private String categoria;
        private String tipoNecesidad;
        private String urgencia;
        private String unidad;
        private String zona;
        private Integer cantidadRequerida;
        private String estado;
        private LocalDateTime fechaCreacion;
    }
}
