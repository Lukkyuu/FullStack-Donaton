package com.donaton.backend.donacion.dto;

import lombok.*;
import java.time.LocalDateTime;

public class DonacionDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private Long centroAcopioId;
        private String descripcion;
        private String categoria;
        private String tipoDonacion;
        private String unidad;
        private String zona;
        private Long necesidadId;
        private Integer cantidad;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String donanteNombre;
        private String centroAcopioNombre;
        private String descripcion;
        private String categoria;
        private String tipoDonacion;
        private String unidad;
        private String zona;
        private Long necesidadId;
        private Integer cantidad;
        private String estado;
        private LocalDateTime fechaCreacion;
    }
}
