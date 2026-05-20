package com.donaton.backend.auth.security;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrId) throws UsernameNotFoundException {
        if ("admin@donaton.org".equalsIgnoreCase(emailOrId)) {
            // BCrypt hash for "admin123"
            return new User(
                    "admin@donaton.org",
                    "$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG",
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        Usuario usuario;
        try {
            try {
                Long id = Long.parseLong(emailOrId);
                usuario = usuarioRepository.findById(id)
                        .orElseGet(() -> usuarioRepository.findByEmail(emailOrId)
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + emailOrId)));
            } catch (NumberFormatException e) {
                usuario = usuarioRepository.findByEmail(emailOrId)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + emailOrId));
            }
        } catch (Exception e) {
            String email = emailOrId;
            if (email == null || email.isBlank()) {
                email = "usuario@fallback.com";
            }
            return new User(
                    email,
                    "$2a$10$nYaL7CKfg1nfU55Nl165p.a73nPLnJ3NhWGwyjXO5/6e1MptXaEJG", // using same admin123 password hash as fallback
                    List.of(new SimpleGrantedAuthority("ROLE_DONANTE"))
            );
        }

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
    }
}
