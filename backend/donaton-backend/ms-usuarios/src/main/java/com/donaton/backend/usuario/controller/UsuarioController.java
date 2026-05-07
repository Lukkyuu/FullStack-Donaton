package com.donaton.backend.usuario.controller;

import com.donaton.backend.usuario.dto.UsuarioDTO;
import com.donaton.backend.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO.PerfilResponse> obtenerPerfil() {
        return ResponseEntity.ok(usuarioService.obtenerPerfil());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO.Response> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioDTO.PerfilResponse> actualizarPerfil(
            @Valid @RequestBody UsuarioDTO.ActualizarPerfilRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(request));
    }

    @PostMapping("/cambiar-contraseña")
    public ResponseEntity<?> cambiarContraseña(
            @Valid @RequestBody UsuarioDTO.CambiarContraseñaRequest request) {
        usuarioService.cambiarContraseña(request);
        return ResponseEntity.ok().body(new MensajeResponse("Contraseña cambiada exitosamente"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok().body(new MensajeResponse("Usuario eliminado exitosamente"));
    }

    public static class MensajeResponse {
        public String mensaje;
        public MensajeResponse(String mensaje) {
            this.mensaje = mensaje;
        }
    }
}
