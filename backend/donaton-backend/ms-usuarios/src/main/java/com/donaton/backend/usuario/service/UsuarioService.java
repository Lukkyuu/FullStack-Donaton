package com.donaton.backend.usuario.service;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.usuario.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<Usuario> MOCK_USUARIOS = new CopyOnWriteArrayList<>();
    private static final AtomicLong USER_ID_GEN = new AtomicLong(10);

    static {
        MOCK_USUARIOS.add(Usuario.builder()
                .id(1L)
                .email("admin@donaton.org")
                .nombre("Administrador Sistema")
                .password("$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG") // admin123
                .rol(Usuario.Rol.ADMIN)
                .build());
        MOCK_USUARIOS.add(Usuario.builder()
                .id(2L)
                .email("ayuda@gmail.com")
                .nombre("Organización Ayuda")
                .password("$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG") // admin123
                .rol(Usuario.Rol.ORGANIZACION)
                .build());
        MOCK_USUARIOS.add(Usuario.builder()
                .id(3L)
                .email("donante@gmail.com")
                .nombre("Juan Pérez")
                .password("$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG") // admin123
                .rol(Usuario.Rol.DONANTE)
                .build());
        MOCK_USUARIOS.add(Usuario.builder()
                .id(4L)
                .email("logistica@donaton.org")
                .nombre("Logística Central")
                .password("$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG") // admin123
                .rol(Usuario.Rol.LOGISTICA)
                .build());
    }

    public List<UsuarioDTO.Response> obtenerTodos() {
        try {
            // Seed base users if not present in database
            try {
                if (!usuarioRepository.findByEmail("admin@donaton.org").isPresent()) {
                    usuarioRepository.save(MOCK_USUARIOS.get(0));
                }
                if (!usuarioRepository.findByEmail("ayuda@gmail.com").isPresent()) {
                    usuarioRepository.save(MOCK_USUARIOS.get(1));
                }
                if (!usuarioRepository.findByEmail("donante@gmail.com").isPresent()) {
                    usuarioRepository.save(MOCK_USUARIOS.get(2));
                }
                if (!usuarioRepository.findByEmail("logistica@donaton.org").isPresent()) {
                    usuarioRepository.save(MOCK_USUARIOS.get(3));
                }
            } catch (Exception ignored) {}

            List<Usuario> usuarios = usuarioRepository.findAll();
            if (usuarios.isEmpty()) {
                return MOCK_USUARIOS.stream().map(this::toResponse).collect(Collectors.toList());
            }
            return usuarios.stream().map(this::toResponse).collect(Collectors.toList());
        } catch (Exception e) {
            return MOCK_USUARIOS.stream().map(this::toResponse).collect(Collectors.toList());
        }
    }

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
            Usuario usuario = usuarioRepository.findById(id).orElseGet(() ->
                MOCK_USUARIOS.stream().filter(u -> u.getId().equals(id)).findFirst().orElseThrow()
            );
            return toResponse(usuario);
        } catch (Exception e) {
            return MOCK_USUARIOS.stream()
                    .filter(u -> u.getId().equals(id))
                    .findFirst()
                    .map(this::toResponse)
                    .orElseGet(() -> UsuarioDTO.Response.builder()
                            .id(id)
                            .email("usuario@fallback.com")
                            .nombre("Usuario Fallback")
                            .rol("DONANTE")
                            .build()
                    );
        }
    }

    public UsuarioDTO.Response crearUsuario(UsuarioDTO.CrearUsuarioRequest request) {
        Usuario.Rol rolEnum = Usuario.Rol.ORGANIZACION;
        try {
            rolEnum = Usuario.Rol.valueOf(request.getRole().toUpperCase());
        } catch (Exception ignored) {}

        Usuario nuevo = Usuario.builder()
                .id(USER_ID_GEN.getAndIncrement())
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(rolEnum)
                .build();

        // Add to mock list
        MOCK_USUARIOS.add(nuevo);

        try {
            Usuario guardado = usuarioRepository.save(nuevo);
            return toResponse(guardado);
        } catch (Exception e) {
            return toResponse(nuevo);
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
            
            if (!usuarioActual.getId().equals(id) && !usuarioActual.getRol().name().equals("ADMIN")) {
                throw new RuntimeException("No tienes permiso para eliminar este usuario");
            }
            
            usuarioRepository.deleteById(id);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("permiso")) {
                throw e;
            }
            // Remove from mock list
            MOCK_USUARIOS.removeIf(u -> u.getId().equals(id));
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
