package com.donaton.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donante_id", nullable = false)
    private Usuario donante;

    @ManyToOne
    @JoinColumn(name = "centro_acopio_id")
    private CentroAcopio centroAcopio;

    @Column(nullable = false)
    private String descripcion;

    private String categoria;

    private Integer cantidad;

    @Enumerated(EnumType.STRING)
    private EstadoDonacion estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    public enum EstadoDonacion {
        PENDIENTE, EN_PROCESO, ENTREGADA, CANCELADA
    }
}
