package com.donaton.backend.usuario.service;

import static org.junit.jupiter.api.Assertions.*;
<<<<<<< HEAD
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
=======
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

<<<<<<< HEAD
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
=======
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.usuario.dto.UsuarioDTO;

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
<<<<<<< HEAD

=======
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

<<<<<<< HEAD
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
=======
    private SecurityContext originalContext;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        originalContext = SecurityContextHolder.getContext();
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }

    @AfterEach
    void tearDown() {
<<<<<<< HEAD
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
=======
        SecurityContextHolder.setContext(originalContext);
    }

    @Test
    void obtenerTodosSuccess() {
        Usuario user = Usuario.builder().id(20L).email("user@donaton.cl").nombre("Name").rol(Usuario.Rol.DONANTE).build();
        when(usuarioRepository.findAll()).thenReturn(List.of(user));

        List<UsuarioDTO.Response> results = usuarioService.obtenerTodos();

        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(u -> u.getEmail().equals("user@donaton.cl")));
    }

    @Test
    void obtenerTodosFallbackOnFailure() {
        when(usuarioRepository.findAll()).thenThrow(new RuntimeException("DB error"));

        List<UsuarioDTO.Response> results = usuarioService.obtenerTodos();
        assertFalse(results.isEmpty());
        assertEquals(4, results.size()); // Static mocks size
    }

    @Test
    void obtenerPerfilSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("pepe@donaton.cl");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(11L).email("pepe@donaton.cl").nombre("Pepe").rol(Usuario.Rol.ORGANIZACION).build();
        when(usuarioRepository.findByEmail("pepe@donaton.cl")).thenReturn(Optional.of(user));

        UsuarioDTO.PerfilResponse profile = usuarioService.obtenerPerfil();

        assertNotNull(profile);
        assertEquals(11L, profile.getId());
        assertEquals("pepe@donaton.cl", profile.getEmail());
        assertEquals("Pepe", profile.getNombre());
        assertEquals("ORGANIZACION", profile.getRol());
    }

    @Test
    void obtenerPerfilFallbackOnFailure() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("juan-perez@donaton.cl");
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_DONANTE"))).when(authentication).getAuthorities();
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(usuarioRepository.findByEmail("juan-perez@donaton.cl")).thenReturn(Optional.empty());

        UsuarioDTO.PerfilResponse profile = usuarioService.obtenerPerfil();

        assertNotNull(profile);
        assertEquals(999L, profile.getId());
        assertEquals("juan-perez@donaton.cl", profile.getEmail());
        assertEquals("Juan-perez", profile.getNombre());
        assertEquals("DONANTE", profile.getRol());
    }

    @Test
    void obtenerPorIdFromDbAndFallback() {
        Usuario user = Usuario.builder().id(5L).email("pepe@gmail.com").nombre("Pepe").rol(Usuario.Rol.DONANTE).build();
        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(user));

        UsuarioDTO.Response response = usuarioService.obtenerPorId(5L);
        assertEquals("pepe@gmail.com", response.getEmail());

        UsuarioDTO.Response responseMock = usuarioService.obtenerPorId(1L);
        assertEquals("admin@donaton.org", responseMock.getEmail());

        UsuarioDTO.Response responseFallback = usuarioService.obtenerPorId(9999L);
        assertEquals("usuario@fallback.com", responseFallback.getEmail());
    }

    @Test
    void crearUsuarioSuccess() {
        UsuarioDTO.CrearUsuarioRequest request = new UsuarioDTO.CrearUsuarioRequest();
        request.setNombre("Nuevo Org");
        request.setEmail("nuevo@org.com");
        request.setPassword("plain-password");
        request.setRole("ORGANIZACION");

        when(passwordEncoder.encode("plain-password")).thenReturn("hashed-pwd");
        Usuario user = Usuario.builder().nombre("Nuevo Org").email("nuevo@org.com").password("hashed-pwd").rol(Usuario.Rol.ORGANIZACION).build();
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(user);

        UsuarioDTO.Response result = usuarioService.crearUsuario(request);

        assertNotNull(result);
        assertEquals("nuevo@org.com", result.getEmail());
    }

    @Test
    void actualizarPerfilSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("change@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(22L).email("change@donaton.org").nombre("Old Name").rol(Usuario.Rol.DONANTE).build();
        when(usuarioRepository.findByEmail("change@donaton.org")).thenReturn(Optional.of(user));

        UsuarioDTO.ActualizarPerfilRequest request = new UsuarioDTO.ActualizarPerfilRequest();
        request.setNombre("New Name");

        UsuarioDTO.PerfilResponse response = usuarioService.actualizarPerfil(request);

        assertEquals("New Name", response.getNombre());
        verify(usuarioRepository).save(user);
    }

    @Test
    void cambiarContraseñaSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("pwd@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(22L).email("pwd@donaton.org").password("hashed-old").build();
        when(usuarioRepository.findByEmail("pwd@donaton.org")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "hashed-old")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("hashed-new");

        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();
        request.setContraseñaActual("old");
        request.setContraseñaNueva("new");

        usuarioService.cambiarContraseña(request);

        assertEquals("hashed-new", user.getPassword());
        verify(usuarioRepository).save(user);
    }

    @Test
    void cambiarContraseñaInvalidThrows() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("pwd@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(22L).email("pwd@donaton.org").password("hashed-old").build();
        when(usuarioRepository.findByEmail("pwd@donaton.org")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed-old")).thenReturn(false);

        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();
        request.setContraseñaActual("wrong");
        request.setContraseñaNueva("new");

        assertThrows(RuntimeException.class, () -> usuarioService.cambiarContraseña(request));
    }

    @Test
    void eliminarUsuarioSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("admin@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario admin = Usuario.builder().id(1L).email("admin@donaton.org").rol(Usuario.Rol.ADMIN).build();
        when(usuarioRepository.findByEmail("admin@donaton.org")).thenReturn(Optional.of(admin));

        usuarioService.eliminarUsuario(5L);

        verify(usuarioRepository).deleteById(5L);
    }

    @Test
    void eliminarUsuarioSelfSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("user@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(5L).email("user@donaton.org").rol(Usuario.Rol.DONANTE).build();
        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(user));

        usuarioService.eliminarUsuario(5L);

        verify(usuarioRepository).deleteById(5L);
    }

    @Test
    void eliminarUsuarioUnauthorizedThrows() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("user@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(5L).email("user@donaton.org").rol(Usuario.Rol.DONANTE).build();
        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> usuarioService.eliminarUsuario(6L));
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    }
}
