package com.donaton.backend.controller;

import com.donaton.backend.model.CentroAcopio;
import com.donaton.backend.model.Donacion;
import com.donaton.backend.service.LogisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistica")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LOGISTICA') or hasRole('ADMIN')")
public class LogisticaController {

    private final LogisticaService logisticaService;

    @GetMapping("/donaciones/pendientes")
    public ResponseEntity<List<Donacion>> obtenerPendientes() {
        return ResponseEntity.ok(logisticaService.obtenerDonacionesPendientes());
    }

    @PostMapping("/donaciones/{donacionId}/asignar/{centroId}")
    public ResponseEntity<Donacion> asignarCentro(
            @PathVariable Long donacionId, @PathVariable Long centroId) {
        return ResponseEntity.ok(logisticaService.asignarCentroAcopio(donacionId, centroId));
    }

    @GetMapping("/centros")
    public ResponseEntity<List<CentroAcopio>> obtenerCentros() {
        return ResponseEntity.ok(logisticaService.obtenerCentrosActivos());
    }

    @PatchMapping("/donaciones/{id}/entregar")
    public ResponseEntity<Donacion> marcarEntregada(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.marcarEntregada(id));
    }
}
