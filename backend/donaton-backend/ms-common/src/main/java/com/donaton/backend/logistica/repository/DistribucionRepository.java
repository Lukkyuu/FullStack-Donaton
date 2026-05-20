package com.donaton.backend.logistica.repository;

import com.donaton.backend.logistica.model.Distribucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistribucionRepository extends JpaRepository<Distribucion, Long> {
}
