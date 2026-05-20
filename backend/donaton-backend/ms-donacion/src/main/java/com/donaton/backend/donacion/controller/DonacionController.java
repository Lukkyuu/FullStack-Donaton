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
    @PreAuthorize("hasRole('DONANTE') or hasRole('ADMIN')")
    public ResponseEntity<DonacionDTO.Response> crear(@RequestBody DonacionDTO.Request request) {
        return ResponseEntity.ok(donacionService.crear(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICA') or hasRole('ORGANIZACION')")
    public ResponseEntity<List<DonacionDTO.Response>> listarTodas() {
        return ResponseEntity.ok(donacionService.listarTodas());
    }

    @GetMapping("/mis-donaciones")
    public ResponseEntity<List<DonacionDTO.Response>> listarMias() {
        return ResponseEntity.ok(donacionService.listarPorDonante());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonacionDTO.Response> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(donacionService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONANTE') or hasRole('ADMIN')")
    public ResponseEntity<DonacionDTO.Response> actualizar(
            @PathVariable Long id, @RequestBody DonacionDTO.Request request) {
        DonacionDTO.Response response = donacionService.actualizar(id, request);
        if (request.getEstado() != null) {
            response = donacionService.actualizarEstado(id, request.getEstado());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('DONANTE') or hasRole('ADMIN')")
    public ResponseEntity<DonacionDTO.Response> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(donacionService.cancelar(id));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('DONANTE') or hasRole('ADMIN')")
    public ResponseEntity<DonacionDTO.Response> cancelarPatch(@PathVariable Long id) {
        return ResponseEntity.ok(donacionService.cancelar(id));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICA')")
    public ResponseEntity<DonacionDTO.Response> actualizarEstado(
            @PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(donacionService.actualizarEstado(id, estado));
    }

    @GetMapping("/campanas")
    public ResponseEntity<List<java.util.Map<String, Object>>> listarCampanas() {
        List<java.util.Map<String, Object>> campanas = new java.util.ArrayList<>();
        
        java.util.Map<String, Object> c1 = new java.util.HashMap<>();
        c1.put("id", 1L);
        c1.put("titulo", "Campaña de Invierno ❄");
        c1.put("descripcion", "Ayúdanos a recolectar frazadas, parkas y ropa de abrigo para los albergues de la Región Metropolitana.");
        c1.put("meta", 500);
        c1.put("recaudado", 320);
        c1.put("estado", "ACTIVA");
        c1.put("fechaFin", "2026-06-30T23:59:59");
        campanas.add(c1);

        java.util.Map<String, Object> c2 = new java.util.HashMap<>();
        c2.put("id", 2L);
        c2.put("titulo", "Reconstrucción Biobío 🏠");
        c2.put("descripcion", "Campaña de recaudación de fondos y herramientas para reconstrucción de hogares afectados por incendios forestales.");
        c2.put("meta", 1000);
        c2.put("recaudado", 680);
        c2.put("estado", "ACTIVA");
        c2.put("fechaFin", "2026-07-15T23:59:59");
        campanas.add(c2);

        java.util.Map<String, Object> c3 = new java.util.HashMap<>();
        c3.put("id", 3L);
        c3.put("titulo", "Útiles Escolares para Todos ✏");
        c3.put("descripcion", "Recolección de cuadernos, lápices y mochilas para niños en situación de vulnerabilidad social en la Región del Maule.");
        c3.put("meta", 300);
        c3.put("recaudado", 120);
        c3.put("estado", "ACTIVA");
        c3.put("fechaFin", "2026-06-10T23:59:59");
        campanas.add(c3);

        return ResponseEntity.ok(campanas);
    }

    @GetMapping("/campanas/{id}")
    public ResponseEntity<java.util.Map<String, Object>> obtenerCampana(@PathVariable Long id) {
        List<java.util.Map<String, Object>> campanas = (List<java.util.Map<String, Object>>) listarCampanas().getBody();
        if (campanas != null) {
            for (java.util.Map<String, Object> c : campanas) {
                if (c.get("id").equals(id)) {
                    return ResponseEntity.ok(c);
                }
            }
        }
        return ResponseEntity.notFound().build();
    }
}
