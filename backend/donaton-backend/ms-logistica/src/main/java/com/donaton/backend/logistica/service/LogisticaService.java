package com.donaton.backend.logistica.service;

import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;
import com.donaton.backend.donacion.repository.DonacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogisticaService {

    private final DonacionRepository donacionRepository;
    private final CentroAcopioRepository centroAcopioRepository;

    public List<Donacion> obtenerDonacionesPendientes() {
        return donacionRepository.findByEstado(Donacion.EstadoDonacion.PENDIENTE);
    }

    public Donacion asignarCentroAcopio(Long donacionId, Long centroId) {
        Donacion donacion = donacionRepository.findById(donacionId).orElseThrow();
        CentroAcopio centro = centroAcopioRepository.findById(centroId).orElseThrow();
        donacion.setCentroAcopio(centro);
        donacion.setEstado(Donacion.EstadoDonacion.EN_PROCESO);
        return donacionRepository.save(donacion);
    }

    public List<CentroAcopio> obtenerCentrosActivos() {
        return centroAcopioRepository.findByActivoTrue();
    }

    public Donacion marcarEntregada(Long donacionId) {
        Donacion donacion = donacionRepository.findById(donacionId).orElseThrow();
        donacion.setEstado(Donacion.EstadoDonacion.ENTREGADA);
        return donacionRepository.save(donacion);
    }
}
