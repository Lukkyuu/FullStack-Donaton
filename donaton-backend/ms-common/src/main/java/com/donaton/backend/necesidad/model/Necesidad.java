package com.donaton.backend.necesidad.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.donaton.backend.auth.model.Usuario;

@Entity
@Table(name = "necesidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Necesidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "beneficiario_id", nullable = false)
    private Usuario beneficiario;

    @Column(nullable = false)
    private String descripcion;

    private String categoria;

    private Integer cantidadRequerida;

    @Enumerated(EnumType.STRING)
    private EstadoNecesidad estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    public enum EstadoNecesidad {
        ACTIVA, EN_PROCESO, SATISFECHA, CANCELADA
    }
}
