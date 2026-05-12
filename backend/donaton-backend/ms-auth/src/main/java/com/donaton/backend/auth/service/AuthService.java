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
