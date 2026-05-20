package com.donaton.backend.logistica.controller;

import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.service.LogisticaService;
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

    // --- Endpoints de Recursos ---

    @GetMapping("/recursos")
    public ResponseEntity<List<Recurso>> obtenerRecursos() {
        return ResponseEntity.ok(logisticaService.obtenerRecursos());
    }

    @GetMapping("/recursos/{id}")
    public ResponseEntity<Recurso> obtenerRecursoPorId(@PathVariable Long id) {
        Recurso recurso = logisticaService.obtenerRecursoPorId(id);
        if (recurso == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recurso);
    }

    @PostMapping("/recursos")
    public ResponseEntity<Recurso> crearRecurso(@RequestBody Recurso recurso) {
        return ResponseEntity.ok(logisticaService.crearRecurso(recurso));
    }

    // --- Endpoints de Distribuciones ---

    @GetMapping("/distribuciones")
    public ResponseEntity<List<Distribucion>> obtenerDistribuciones() {
        return ResponseEntity.ok(logisticaService.obtenerDistribuciones());
    }

    @GetMapping("/distribuciones/{id}")
    public ResponseEntity<Distribucion> obtenerDistribucionPorId(@PathVariable Long id) {
        Distribucion distribucion = logisticaService.obtenerDistribucionPorId(id);
        if (distribucion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(distribucion);
    }

    @PostMapping("/distribuciones")
    public ResponseEntity<Distribucion> crearDistribucion(@RequestBody Distribucion distribucion) {
        return ResponseEntity.ok(logisticaService.crearDistribucion(distribucion));
    }
}
