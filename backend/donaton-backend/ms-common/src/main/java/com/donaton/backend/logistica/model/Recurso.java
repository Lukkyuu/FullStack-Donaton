package com.donaton.backend.logistica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recursos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String tipo;
    private Double cantidad;
    private String unidad;
    private String zona;
}
