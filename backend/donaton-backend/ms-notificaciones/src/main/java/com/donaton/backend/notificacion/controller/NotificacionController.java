package com.donaton.backend.notificacion.controller;

import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<NotificacionDTO.Response>> obtenerMisNotificaciones() {
        return ResponseEntity.ok(notificacionService.obtenerMisNotificaciones());
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<List<NotificacionDTO.Response>> obtenerNoLeidas() {
        return ResponseEntity.ok(notificacionService.obtenerNoLeidas());
    }

    @PutMapping("/preferencias/{usuarioId}")
    public ResponseEntity<NotificacionDTO.PreferenciasResponse> establecerPreferencias(
            @PathVariable Long usuarioId, 
            @RequestBody NotificacionDTO.PreferenciasRequest request) {
        notificacionService.establecerPreferencias(usuarioId, request);
        return ResponseEntity.ok(notificacionService.obtenerPreferencias(usuarioId));
    }

    @GetMapping("/preferencias/{usuarioId}")
    public ResponseEntity<NotificacionDTO.PreferenciasResponse> obtenerPreferencias(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerPreferencias(usuarioId));
    }
}
