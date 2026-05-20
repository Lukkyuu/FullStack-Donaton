package com.donaton.backend.logistica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "distribuciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Distribucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recursoId;
    private Long necesidadId;
    private Double cantidad;
    private String unidad;
    private String destinatario;
    private String zona;

    @Builder.Default
    private String estado = "EN_TRANSITO";
}
