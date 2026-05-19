package com.donaton.backend.donacion.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.logistica.model.CentroAcopio;

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

    private String tipoDonacion;

    private String unidad;

    private String zona;

    @Column(name = "necesidad_id")
    private Long necesidadId;

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
