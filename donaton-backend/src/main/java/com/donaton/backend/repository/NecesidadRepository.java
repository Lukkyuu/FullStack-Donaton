package com.donaton.backend.repository;

import com.donaton.backend.model.Necesidad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NecesidadRepository extends JpaRepository<Necesidad, Long> {
    List<Necesidad> findByBeneficiarioId(Long beneficiarioId);
    List<Necesidad> findByEstado(Necesidad.EstadoNecesidad estado);
    List<Necesidad> findByCategoria(String categoria);
}
