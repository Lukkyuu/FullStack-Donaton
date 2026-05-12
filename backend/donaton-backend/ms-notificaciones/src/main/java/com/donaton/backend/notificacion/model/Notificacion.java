package com.donaton.backend.notificacion.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.donaton.backend.auth.model.Usuario;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    private boolean leida;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (!leida) {
            leida = false;
        }
    }
}
