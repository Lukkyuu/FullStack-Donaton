package com.donaton.backend.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.model.PasswordResetToken;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.PasswordResetTokenRepository;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.auth.security.JwtUtil;
import com.donaton.backend.auth.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
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

    private Usuario mockUser;

    @BeforeEach
    void setUp() {
        mockUser = Usuario.builder()
                .id(1L)
                .email("test@donaton.org")
                .nombre("Test User")
                .password("encoded_pass")
                .rol(Usuario.Rol.DONANTE)
                .build();
    }

    @Test
    void loginShouldReturnAuthResponseOnSuccess() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("test@donaton.org");
        request.setPassword("password123");

        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(mockUser)).thenReturn("mock_token");

        AuthDTO.AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_token", response.getToken());
        assertEquals("test@donaton.org", response.getEmail());
        assertEquals("Test User", response.getNombre());
        assertEquals("DONANTE", response.getRol());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void registerShouldThrowExceptionWhenEmailExists() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("test@donaton.org");
        request.setPassword("password123");
        request.setNombre("Test User");
        request.setRol("DONANTE");

        when(usuarioRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registerShouldSaveUserAndReturnResponseOnSuccess() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("new@donaton.org");
        request.setPassword("password123");
        request.setNombre("New User");
        request.setRol("DONANTE");

        Usuario savedUser = Usuario.builder()
                .id(2L)
                .email("new@donaton.org")
                .nombre("New User")
                .password("encoded_pass")
                .rol(Usuario.Rol.DONANTE)
                .build();

        when(usuarioRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded_pass");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(any(Usuario.class))).thenReturn("new_mock_token");

        AuthDTO.AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new_mock_token", response.getToken());
        assertEquals("new@donaton.org", response.getEmail());
        assertEquals("New User", response.getNombre());
        assertEquals("DONANTE", response.getRol());
    }

    @Test
    void recuperarPasswordShouldDoNothingIfEmailNotExists() {
        when(usuarioRepository.findByEmail("nonexistent@donaton.org")).thenReturn(Optional.empty());

        authService.recuperarPassword("nonexistent@donaton.org");

        verify(tokenRepository, never()).deleteByUsuarioId(anyLong());
        verify(tokenRepository, never()).save(any());
    }

    @Test
    void recuperarPasswordShouldCreateTokenIfEmailExists() {
        when(usuarioRepository.findByEmail("test@donaton.org")).thenReturn(Optional.of(mockUser));

        authService.recuperarPassword("test@donaton.org");

        verify(tokenRepository).deleteByUsuarioId(mockUser.getId());
        verify(tokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void resetPasswordShouldThrowExceptionIfTokenNotFound() {
        when(tokenRepository.findByToken("invalid_token")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.resetPassword("invalid_token", "newPass"));
    }

    @Test
    void resetPasswordShouldThrowExceptionIfTokenExpired() {
        PasswordResetToken expiredToken = PasswordResetToken.builder()
                .token("expired_token")
                .usuario(mockUser)
                .expiryDate(LocalDateTime.now().minusMinutes(5))
                .build();

        when(tokenRepository.findByToken("expired_token")).thenReturn(Optional.of(expiredToken));

        assertThrows(RuntimeException.class, () -> authService.resetPassword("expired_token", "newPass"));
        verify(tokenRepository).delete(expiredToken);
    }

    @Test
    void resetPasswordShouldUpdatePasswordOnSuccess() {
        PasswordResetToken validToken = PasswordResetToken.builder()
                .token("valid_token")
                .usuario(mockUser)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        when(tokenRepository.findByToken("valid_token")).thenReturn(Optional.of(validToken));
        when(passwordEncoder.encode("newPassword")).thenReturn("new_encoded_pass");

        authService.resetPassword("valid_token", "newPassword");

        assertEquals("new_encoded_pass", mockUser.getPassword());
        verify(usuarioRepository).save(mockUser);
        verify(tokenRepository).delete(validToken);
    }
}
