package com.donaton.backend.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.model.PasswordResetToken;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.PasswordResetTokenRepository;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.auth.security.JwtUtil;
import com.donaton.backend.auth.security.UserDetailsServiceImpl;

class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsServiceImpl userDetailsService;
    @Mock
    private JdbcTemplate jdbcTemplate;
    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loginWithAdminEmail() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("admin@donaton.org");
        request.setPassword("password");

        when(jwtUtil.generateToken(any(Usuario.class))).thenReturn("admin-token");

        AuthDTO.AuthResponse response = authService.login(request);

        assertEquals("admin-token", response.getToken());
        assertEquals("admin@donaton.org", response.getEmail());
        assertEquals("ADMIN", response.getRol());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginWithExistingUser() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("user@donaton.org");
        request.setPassword("password");

        Usuario user = Usuario.builder()
                .id(1L)
                .email("user@donaton.org")
                .nombre("Test User")
                .rol(Usuario.Rol.DONANTE)
                .build();

        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("user-token");

        AuthDTO.AuthResponse response = authService.login(request);

        assertEquals("user-token", response.getToken());
        assertEquals("user@donaton.org", response.getEmail());
        assertEquals("Test User", response.getNombre());
        assertEquals("DONANTE", response.getRol());
    }

    @Test
    void loginWithNonExistingUserCreatesFallback() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("newuser@donaton.org");
        request.setPassword("password");

        when(usuarioRepository.findByEmail("newuser@donaton.org")).thenReturn(Optional.empty());
        when(jwtUtil.generateToken(any(Usuario.class))).thenReturn("fallback-token");

        AuthDTO.AuthResponse response = authService.login(request);

        assertEquals("fallback-token", response.getToken());
        assertEquals("newuser@donaton.org", response.getEmail());
        assertEquals("Newuser", response.getNombre());
        assertEquals("DONANTE", response.getRol());
    }

    @Test
    void registerWithExistingEmailThrowsException() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("duplicate@donaton.org");
        request.setPassword("password");
        request.setNombre("Duplicate");
        request.setRol("DONANTE");

        when(usuarioRepository.existsByEmail("duplicate@donaton.org")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void registerWithAdminRoleThrowsException() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("adminreg@donaton.org");
        request.setPassword("password");
        request.setNombre("Admin Reg");
        request.setRol("ADMIN");

        when(usuarioRepository.existsByEmail("adminreg@donaton.org")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void registerSuccess() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("newreg@donaton.org");
        request.setPassword("password");
        request.setNombre("New Reg");
        request.setRol("ORGANIZACION");

        Usuario savedUser = Usuario.builder()
                .id(123L)
                .email("newreg@donaton.org")
                .nombre("New Reg")
                .rol(Usuario.Rol.ORGANIZACION)
                .build();

        when(usuarioRepository.existsByEmail("newreg@donaton.org")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashed-pwd");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(any(Usuario.class))).thenReturn("reg-token");
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), any())).thenReturn(1);

        AuthDTO.AuthResponse response = authService.register(request);

        assertEquals("reg-token", response.getToken());
        assertEquals("ORGANIZACION", response.getRol());
        verify(jdbcTemplate).update(anyString(), eq(123L), eq("BIENVENIDA"), eq("¡Bienvenido a Donaton!"), anyString(), eq(false), any());
    }

    @Test
    void registerSuccessWithDefaultRol() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("newreg@donaton.org");
        request.setPassword("password");
        request.setNombre("New Reg");
        request.setRol(null);

        Usuario savedUser = Usuario.builder()
                .id(123L)
                .email("newreg@donaton.org")
                .nombre("New Reg")
                .rol(Usuario.Rol.DONANTE)
                .build();

        when(usuarioRepository.existsByEmail("newreg@donaton.org")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashed-pwd");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(any(Usuario.class))).thenReturn("reg-token");
        doThrow(new RuntimeException("DB error")).when(jdbcTemplate).update(anyString(), any(), any(), any(), any(), any(), any());

        AuthDTO.AuthResponse response = authService.register(request);

        assertEquals("reg-token", response.getToken());
        assertEquals("DONANTE", response.getRol());
    }

    @Test
    void refreshTokenSuccess() {
        Usuario user = Usuario.builder()
                .id(1L)
                .email("user@donaton.org")
                .nombre("Test User")
                .rol(Usuario.Rol.DONANTE)
                .build();

        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("new-token");

        AuthDTO.AuthResponse response = authService.refreshToken("user@donaton.org");

        assertEquals("new-token", response.getToken());
        assertEquals("user@donaton.org", response.getEmail());
    }

    @Test
    void recuperarPasswordWithNonExistingEmailReturnsEarly() {
        when(usuarioRepository.findByEmail("notfound@donaton.org")).thenReturn(Optional.empty());

        authService.recuperarPassword("notfound@donaton.org");

        verify(tokenRepository, never()).deleteByUsuarioId(anyLong());
        verify(tokenRepository, never()).save(any());
    }

    @Test
    void recuperarPasswordWithExistingEmail() {
        Usuario user = Usuario.builder()
                .id(456L)
                .email("found@donaton.org")
                .build();

        when(usuarioRepository.findByEmail("found@donaton.org")).thenReturn(Optional.of(user));

        authService.recuperarPassword("found@donaton.org");

        verify(tokenRepository).deleteByUsuarioId(456L);
        verify(tokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void resetPasswordWithInvalidTokenThrows() {
        when(tokenRepository.findByToken("invalid")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.resetPassword("invalid", "new-pwd"));
    }

    @Test
    void resetPasswordWithExpiredTokenThrows() {
        PasswordResetToken token = PasswordResetToken.builder()
                .token("expired")
                .expiryDate(LocalDateTime.now().minusMinutes(5))
                .build();

        when(tokenRepository.findByToken("expired")).thenReturn(Optional.of(token));

        assertThrows(RuntimeException.class, () -> authService.resetPassword("expired", "new-pwd"));
        verify(tokenRepository).delete(token);
    }

    @Test
    void resetPasswordSuccess() {
        Usuario user = Usuario.builder()
                .id(1L)
                .email("user@donaton.org")
                .password("old-pwd")
                .build();

        PasswordResetToken token = PasswordResetToken.builder()
                .token("valid")
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .usuario(user)
                .build();

        when(tokenRepository.findByToken("valid")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("new-pwd")).thenReturn("hashed-new-pwd");

        authService.resetPassword("valid", "new-pwd");

        assertEquals("hashed-new-pwd", user.getPassword());
        verify(usuarioRepository).save(user);
        verify(tokenRepository).delete(token);
    }
}
