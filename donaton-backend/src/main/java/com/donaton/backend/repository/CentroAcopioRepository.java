package com.donaton.backend.repository;

import com.donaton.backend.model.CentroAcopio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CentroAcopioRepository extends JpaRepository<CentroAcopio, Long> {
    List<CentroAcopio> findByActivoTrue();
    List<CentroAcopio> findByCiudad(String ciudad);
}
