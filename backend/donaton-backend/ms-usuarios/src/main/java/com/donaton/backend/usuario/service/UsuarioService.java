package com.donaton.backend.usuario.service;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.usuario.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioDTO.PerfilResponse obtenerPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return toPerfilResponse(usuario);
    }

    public UsuarioDTO.Response obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        return toResponse(usuario);
    }

    public UsuarioDTO.PerfilResponse actualizarPerfil(UsuarioDTO.ActualizarPerfilRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        usuario.setNombre(request.getNombre());
        usuarioRepository.save(usuario);
        
        return toPerfilResponse(usuario);
    }

    public void cambiarContraseña(UsuarioDTO.CambiarContraseñaRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        if (!passwordEncoder.matches(request.getContraseñaActual(), usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }
        
        usuario.setPassword(passwordEncoder.encode(request.getContraseñaNueva()));
        usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioActual = usuarioRepository.findByEmail(email).orElseThrow();
        
        if (!usuarioActual.getId().equals(id)) {
            throw new RuntimeException("No tienes permiso para eliminar este usuario");
        }
        
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO.Response toResponse(Usuario u) {
        return UsuarioDTO.Response.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .rol(u.getRol().name())
                .fechaCreacion(null)
                .build();
    }

    private UsuarioDTO.PerfilResponse toPerfilResponse(Usuario u) {
        return UsuarioDTO.PerfilResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .rol(u.getRol().name())
                .fechaCreacion(null)
                .build();
    }
}
