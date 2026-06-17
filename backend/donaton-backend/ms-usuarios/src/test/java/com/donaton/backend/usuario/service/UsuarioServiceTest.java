package com.donaton.backend.usuario.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.usuario.dto.UsuarioDTO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario mockUser;
    private SecurityContext previousContext;

    @BeforeEach
    void setUp() {
        previousContext = SecurityContextHolder.getContext();
        mockUser = Usuario.builder()
                .id(3L)
                .email("donante@gmail.com")
                .nombre("Juan Pérez")
                .password("$2a$10$nYaL7CKfg1nfU55Nl165p")
                .rol(Usuario.Rol.DONANTE)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(previousContext);
    }

    @Test
    void obtenerTodosShouldReturnList() {
        when(usuarioRepository.findAll()).thenReturn(List.of(mockUser));

        List<UsuarioDTO.Response> result = usuarioService.obtenerTodos();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("donante@gmail.com", result.get(0).getEmail());
    }

    @Test
    void obtenerPerfilShouldReturnFromDbIfAuthenticatedAndExists() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("donante@gmail.com");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("donante@gmail.com")).thenReturn(Optional.of(mockUser));

        UsuarioDTO.PerfilResponse perfil = usuarioService.obtenerPerfil();

        assertNotNull(perfil);
        assertEquals("donante@gmail.com", perfil.getEmail());
        assertEquals("Juan Pérez", perfil.getNombre());
    }

    @Test
    void obtenerPorIdShouldReturnUser() {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(mockUser));

        UsuarioDTO.Response response = usuarioService.obtenerPorId(3L);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("Juan Pérez", response.getNombre());
    }

    @Test
    void crearUsuarioShouldSaveAndReturnResponse() {
        UsuarioDTO.CrearUsuarioRequest request = new UsuarioDTO.CrearUsuarioRequest();
        request.setEmail("newuser@gmail.com");
        request.setNombre("Nuevo Usuario");
        request.setPassword("password123");
        request.setRole("ORGANIZACION");

        Usuario savedUser = Usuario.builder()
                .id(10L)
                .email("newuser@gmail.com")
                .nombre("Nuevo Usuario")
                .rol(Usuario.Rol.ORGANIZACION)
                .build();

        when(passwordEncoder.encode("password123")).thenReturn("hashedPass");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUser);

        UsuarioDTO.Response response = usuarioService.crearUsuario(request);

        assertNotNull(response);
        assertEquals("newuser@gmail.com", response.getEmail());
        assertEquals("Nuevo Usuario", response.getNombre());
    }

    @Test
    void cambiarContraseñaShouldSucceedWhenOldPasswordMatches() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("donante@gmail.com");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("donante@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("oldPass", mockUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("newHashedPass");

        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();
        request.setContraseñaActual("oldPass");
        request.setContraseñaNueva("newPass");

        assertDoesNotThrow(() -> usuarioService.cambiarContraseña(request));
        verify(usuarioRepository).save(mockUser);
    }

    @Test
    void cambiarContraseñaShouldThrowExceptionWhenOldPasswordIncorrect() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("donante@gmail.com");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("donante@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongPass", mockUser.getPassword())).thenReturn(false);

        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();
        request.setContraseñaActual("wrongPass");
        request.setContraseñaNueva("newPass");

        assertThrows(RuntimeException.class, () -> usuarioService.cambiarContraseña(request));
        verify(usuarioRepository, never()).save(any());
    }
}
