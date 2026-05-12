package com.donaton.backend.matching.controller;

import com.donaton.backend.matching.dto.MatchingDTO;
import com.donaton.backend.matching.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MatchingDTO.Response> crear(@RequestBody MatchingDTO.CreateRequest request) {
        return ResponseEntity.ok(matchingService.crear(request));
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MatchingDTO.Response>> listarPendientes() {
        return ResponseEntity.ok(matchingService.listarPendientes());
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MatchingDTO.Response> actualizarEstado(
            @PathVariable Long id, @RequestBody MatchingDTO.ActualizarEstadoRequest request) {
        return ResponseEntity.ok(matchingService.actualizarEstado(id, request.getEstado()));
    }
}
