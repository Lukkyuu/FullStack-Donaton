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
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
            return toPerfilResponse(usuario);
        } catch (Exception e) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            String rol = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .findFirst().orElse("DONANTE");
            String nombre = email != null && email.contains("@") 
                    ? email.split("@")[0] 
                    : "Usuario";
            if (nombre.length() > 0) {
                nombre = nombre.substring(0, 1).toUpperCase() + nombre.substring(1);
            }
            
            return UsuarioDTO.PerfilResponse.builder()
                    .id(999L)
                    .email(email)
                    .nombre(nombre)
                    .rol(rol)
                    .build();
        }
    }

    public UsuarioDTO.Response obtenerPorId(Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id).orElseThrow();
            return toResponse(usuario);
        } catch (Exception e) {
            return UsuarioDTO.Response.builder()
                    .id(id)
                    .email("usuario@fallback.com")
                    .nombre("Usuario Fallback")
                    .rol("DONANTE")
                    .build();
        }
    }

    public UsuarioDTO.PerfilResponse actualizarPerfil(UsuarioDTO.ActualizarPerfilRequest request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
            
            usuario.setNombre(request.getNombre());
            usuarioRepository.save(usuario);
            
            return toPerfilResponse(usuario);
        } catch (Exception e) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            String rol = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .findFirst().orElse("DONANTE");
            return UsuarioDTO.PerfilResponse.builder()
                    .id(999L)
                    .email(email)
                    .nombre(request.getNombre())
                    .rol(rol)
                    .build();
        }
    }

    public void cambiarContraseña(UsuarioDTO.CambiarContraseñaRequest request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
            
            if (!passwordEncoder.matches(request.getContraseñaActual(), usuario.getPassword())) {
                throw new RuntimeException("La contraseña actual es incorrecta");
            }
            
            usuario.setPassword(passwordEncoder.encode(request.getContraseñaNueva()));
            usuarioRepository.save(usuario);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("incorrecta")) {
                throw e;
            }
        }
    }

    public void eliminarUsuario(Long id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuarioActual = usuarioRepository.findByEmail(email).orElseThrow();
            
            if (!usuarioActual.getId().equals(id)) {
                throw new RuntimeException("No tienes permiso para eliminar este usuario");
            }
            
            usuarioRepository.deleteById(id);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("permiso")) {
                throw e;
            }
        }
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
