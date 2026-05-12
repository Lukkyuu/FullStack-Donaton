package com.donaton.backend.matching.repository;

import com.donaton.backend.matching.model.Matching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingRepository extends JpaRepository<Matching, Long> {
    List<Matching> findByEstado(Matching.EstadoMatching estado);
    List<Matching> findByDonacionId(Long donacionId);
    List<Matching> findByNecesidadId(Long necesidadId);
}
