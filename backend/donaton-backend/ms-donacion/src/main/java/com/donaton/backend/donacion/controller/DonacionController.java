package com.donaton.backend.donacion.controller;

import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.service.DonacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
@RequiredArgsConstructor
public class DonacionController {

    private final DonacionService donacionService;

    @PostMapping
    @PreAuthorize("hasRole('DONANTE')")
    public ResponseEntity<DonacionDTO.Response> crear(@RequestBody DonacionDTO.Request request) {
        return ResponseEntity.ok(donacionService.crear(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICA')")
    public ResponseEntity<List<DonacionDTO.Response>> listarTodas() {
        return ResponseEntity.ok(donacionService.listarTodas());
    }

    @GetMapping("/mis-donaciones")
    public ResponseEntity<List<DonacionDTO.Response>> listarMias() {
        return ResponseEntity.ok(donacionService.listarPorDonante());
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICA')")
    public ResponseEntity<DonacionDTO.Response> actualizarEstado(
            @PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(donacionService.actualizarEstado(id, estado));
    }
}
