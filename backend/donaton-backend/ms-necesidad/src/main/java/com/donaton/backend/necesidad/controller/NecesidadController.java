package com.donaton.backend.necesidad.controller;

import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.service.NecesidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/necesidades")
@RequiredArgsConstructor
public class NecesidadController {

    private final NecesidadService necesidadService;

    @PostMapping
    public ResponseEntity<NecesidadDTO.Response> crear(@RequestBody NecesidadDTO.Request request) {
        return ResponseEntity.ok(necesidadService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<NecesidadDTO.Response>> listarActivas() {
        return ResponseEntity.ok(necesidadService.listarActivas());
    }

    @GetMapping("/mis-necesidades")
    public ResponseEntity<List<NecesidadDTO.Response>> listarMias() {
        return ResponseEntity.ok(necesidadService.listarPorBeneficiario());
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NecesidadDTO.Response> actualizarEstado(
            @PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(necesidadService.actualizarEstado(id, estado));
    }
}
