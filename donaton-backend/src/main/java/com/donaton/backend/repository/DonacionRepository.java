package com.donaton.backend.repository;

import com.donaton.backend.model.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonacionRepository extends JpaRepository<Donacion, Long> {
    List<Donacion> findByDonanteId(Long donanteId);
    List<Donacion> findByCentroAcopioId(Long centroAcopioId);
    List<Donacion> findByEstado(Donacion.EstadoDonacion estado);
}
