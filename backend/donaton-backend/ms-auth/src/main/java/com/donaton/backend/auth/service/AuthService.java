package com.donaton.backend.auth.service;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.auth.security.JwtUtil;
import com.donaton.backend.auth.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final EnumSet<Usuario.Rol> ROLES_PUBLICOS = EnumSet.of(
            Usuario.Rol.DONANTE,
            Usuario.Rol.ORGANIZACION
    );

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JdbcTemplate jdbcTemplate;

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(usuario);
        return new AuthDTO.AuthResponse(token, usuario.getEmail(), usuario.getNombre(), usuario.getRol().name());
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya esta registrado");
        }

        Usuario.Rol rol = obtenerRolPermitido(request.getRol());

        Usuario usuario = Usuario.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .rol(rol)
                .build();

        usuario = usuarioRepository.save(usuario);

        // Simulación de envío de correo de bienvenida
        System.out.println("\n==================================================");
        System.out.println("📧 SIMULANDO ENVÍO DE CORREO DE BIENVENIDA:");
        System.out.println("Para: " + usuario.getEmail());
        System.out.println("Asunto: ¡Bienvenido a Donaton! Cuenta creada con éxito");
        System.out.println("Contenido:\nHola " + usuario.getNombre() + ",\nTu cuenta ha sido creada con éxito. Bienvenido a Donaton, tu plataforma de gestión humanitaria.");
        System.out.println("==================================================\n");

        // Insertar registro en notificaciones
        try {
            jdbcTemplate.update(
                "INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, leida, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)",
                usuario.getId(),
                "BIENVENIDA",
                "¡Bienvenido a Donaton!",
                "Hola " + usuario.getNombre() + ", tu cuenta ha sido creada con éxito. ¡Gracias por unirte a nosotros!",
                false,
                java.time.LocalDateTime.now()
            );
        } catch (Exception e) {
            System.err.println("No se pudo insertar la notificación de bienvenida: " + e.getMessage());
        }

        String token = jwtUtil.generateToken(usuario);
        return new AuthDTO.AuthResponse(token, usuario.getEmail(), usuario.getNombre(), usuario.getRol().name());
    }

    private Usuario.Rol obtenerRolPermitido(String rolSolicitado) {
        Usuario.Rol rol = rolSolicitado == null || rolSolicitado.isBlank()
                ? Usuario.Rol.DONANTE
                : Usuario.Rol.valueOf(rolSolicitado.trim().toUpperCase());

        if (!ROLES_PUBLICOS.contains(rol)) {
            throw new RuntimeException("No se permite registrar usuarios con roles administrativos");
        }

        return rol;
    }

    public AuthDTO.AuthResponse refreshToken(String currentEmail) {
        Usuario usuario = usuarioRepository.findByEmail(currentEmail).orElseThrow();
        String newToken = jwtUtil.generateToken(usuario);
        return new AuthDTO.AuthResponse(newToken, usuario.getEmail(), usuario.getNombre(), usuario.getRol().name());
    }
}
