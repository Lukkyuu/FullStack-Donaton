package com.donaton.backend.matching.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.necesidad.model.Necesidad;

@Entity
@Table(name = "matchings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Matching {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donacion_id", nullable = false)
    private Donacion donacion;

    @ManyToOne
    @JoinColumn(name = "necesidad_id", nullable = false)
    private Necesidad necesidad;

    @Enumerated(EnumType.STRING)
    private EstadoMatching estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (estado == null) {
            estado = EstadoMatching.PENDIENTE;
        }
    }

    public enum EstadoMatching {
        PENDIENTE, ACEPTADA, RECHAZADA, COMPLETADA
    }
}
