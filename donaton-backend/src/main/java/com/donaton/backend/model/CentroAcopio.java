package com.donaton.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "centros_acopio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CentroAcopio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    private String ciudad;

    private String telefono;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @JsonIgnore
    @OneToMany(mappedBy = "centroAcopio")
    private List<Donacion> donaciones;
}
