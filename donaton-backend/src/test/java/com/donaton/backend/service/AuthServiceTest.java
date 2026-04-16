package com.donaton.backend.service;

import com.donaton.backend.dto.AuthDTO;
import com.donaton.backend.model.Usuario;
import com.donaton.backend.repository.UsuarioRepository;
import com.donaton.backend.security.JwtUtil;
import com.donaton.backend.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsServiceImpl userDetailsService;

    @InjectMocks private AuthService authService;

    private Usuario usuario;
    private User userDetails;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1L)
                .email("test@test.com")
                .password("encoded_password")
                .nombre("Test User")
                .rol(Usuario.Rol.DONANTE)
                .build();

        userDetails = new User("test@test.com", "encoded_password",
                List.of(new SimpleGrantedAuthority("ROLE_DONANTE")));
    }

    @Test
    void login_credencialesValidas_retornaToken() {
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(Optional.of(usuario));
        when(userDetailsService.loadUserByUsername("test@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwt_token");

        AuthDTO.AuthResponse response = authService.login(
                new AuthDTO.LoginRequest("test@test.com", "password123"));

        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getEmail()).isEqualTo("test@test.com");
        assertThat(response.getNombre()).isEqualTo("Test User");
        assertThat(response.getRol()).isEqualTo("DONANTE");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_credencialesInvalidas_lanzaExcepcion() {
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(
                new AuthDTO.LoginRequest("test@test.com", "wrong")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void register_emailNuevo_creaUsuarioYRetornaToken() {
        when(usuarioRepository.existsByEmail("nuevo@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(userDetailsService.loadUserByUsername("nuevo@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwt_token");

        AuthDTO.AuthResponse response = authService.register(
                new AuthDTO.RegisterRequest("nuevo@test.com", "password123", "Nuevo", "DONANTE"));

        assertThat(response.getToken()).isEqualTo("jwt_token");
        verify(usuarioRepository).save(any(Usuario.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_emailExistente_lanzaExcepcion() {
        when(usuarioRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new AuthDTO.RegisterRequest("test@test.com", "password", "Test", null)))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("email");
    }

    @Test
    void register_sinRol_asignaDONANTEPorDefecto() {
        when(usuarioRepository.existsByEmail("nuevo@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userDetailsService.loadUserByUsername(any())).thenReturn(userDetails);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        authService.register(new AuthDTO.RegisterRequest("nuevo@test.com", "pass", "Nombre", null));

        verify(usuarioRepository).save(argThat(u -> u.getRol() == Usuario.Rol.DONANTE));
    }
}
