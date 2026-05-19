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
        Usuario usuario;
        try {
            Long id = Long.parseLong(emailOrId);
            usuario = usuarioRepository.findById(id)
                    .orElseGet(() -> usuarioRepository.findByEmail(emailOrId)
                            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + emailOrId)));
        } catch (NumberFormatException e) {
            usuario = usuarioRepository.findByEmail(emailOrId)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + emailOrId));
        }

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
    }
}
