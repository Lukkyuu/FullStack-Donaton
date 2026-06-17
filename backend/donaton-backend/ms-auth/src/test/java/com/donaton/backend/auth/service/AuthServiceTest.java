package com.donaton.backend.auth.service;

import static org.junit.jupiter.api.Assertions.*;
<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

=======
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

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
import com.donaton.backend.auth.dto.AuthDTO;
import com.donaton.backend.auth.model.PasswordResetToken;
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.PasswordResetTokenRepository;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.auth.security.JwtUtil;
import com.donaton.backend.auth.security.UserDetailsServiceImpl;
<<<<<<< HEAD
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
=======

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
<<<<<<< HEAD

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

=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @InjectMocks
    private AuthService authService;

<<<<<<< HEAD
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

=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
<<<<<<< HEAD
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
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        assertEquals("DONANTE", response.getRol());
    }

    @Test
<<<<<<< HEAD
    void recuperarPasswordShouldDoNothingIfEmailNotExists() {
        when(usuarioRepository.findByEmail("nonexistent@donaton.org")).thenReturn(Optional.empty());

        authService.recuperarPassword("nonexistent@donaton.org");
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

        verify(tokenRepository, never()).deleteByUsuarioId(anyLong());
        verify(tokenRepository, never()).save(any());
    }

    @Test
<<<<<<< HEAD
    void recuperarPasswordShouldCreateTokenIfEmailExists() {
        when(usuarioRepository.findByEmail("test@donaton.org")).thenReturn(Optional.of(mockUser));

        authService.recuperarPassword("test@donaton.org");

        verify(tokenRepository).deleteByUsuarioId(mockUser.getId());
=======
    void recuperarPasswordWithExistingEmail() {
        Usuario user = Usuario.builder()
                .id(456L)
                .email("found@donaton.org")
                .build();

        when(usuarioRepository.findByEmail("found@donaton.org")).thenReturn(Optional.of(user));

        authService.recuperarPassword("found@donaton.org");

        verify(tokenRepository).deleteByUsuarioId(456L);
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        verify(tokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
<<<<<<< HEAD
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
=======
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
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
