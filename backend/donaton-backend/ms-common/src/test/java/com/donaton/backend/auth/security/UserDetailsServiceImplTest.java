package com.donaton.backend.auth.security;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.model.Usuario.Rol;
import com.donaton.backend.auth.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private Usuario mockUsuario;

    @BeforeEach
    public void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        mockUsuario.setEmail("test@donaton.cl");
        mockUsuario.setPassword("password123");
        mockUsuario.setRol(Rol.DONANTE);
    }

    @Test
    public void testLoadUserByUsername_AdminHardcoded() {
        UserDetails admin = userDetailsService.loadUserByUsername("admin@donaton.org");
        assertNotNull(admin);
        assertEquals("admin@donaton.org", admin.getUsername());
        assertTrue(admin.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    public void testLoadUserByUsername_NumericIdFound() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(mockUsuario));

        UserDetails user = userDetailsService.loadUserByUsername("1");
        assertNotNull(user);
        assertEquals("test@donaton.cl", user.getUsername());
        assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DONANTE")));
    }

    @Test
    public void testLoadUserByUsername_NumericIdNotFoundEmailFound() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail("1")).thenReturn(Optional.of(mockUsuario));

        UserDetails user = userDetailsService.loadUserByUsername("1");
        assertNotNull(user);
        assertEquals("test@donaton.cl", user.getUsername());
    }

    @Test
    public void testLoadUserByUsername_EmailFound() {
        when(usuarioRepository.findByEmail("test@donaton.cl")).thenReturn(Optional.of(mockUsuario));

        UserDetails user = userDetailsService.loadUserByUsername("test@donaton.cl");
        assertNotNull(user);
        assertEquals("test@donaton.cl", user.getUsername());
    }

    @Test
    public void testLoadUserByUsername_NotFoundFallback() {
        when(usuarioRepository.findByEmail("nonexistent@donaton.cl")).thenReturn(Optional.empty());

        UserDetails user = userDetailsService.loadUserByUsername("nonexistent@donaton.cl");
        assertNotNull(user);
        assertEquals("nonexistent@donaton.cl", user.getUsername());
        assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DONANTE")));
    }

    @Test
    public void testLoadUserByUsername_ExceptionFallback() {
        UserDetails user = userDetailsService.loadUserByUsername(null);
        assertNotNull(user);
        assertEquals("usuario@fallback.com", user.getUsername());
    }
}
