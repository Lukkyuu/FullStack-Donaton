package com.donaton.backend.usuario.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.donaton.backend.usuario.dto.UsuarioDTO;
import com.donaton.backend.usuario.service.UsuarioService;

class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerTodos() {
        List<UsuarioDTO.Response> expected = List.of(new UsuarioDTO.Response());
        when(usuarioService.obtenerTodos()).thenReturn(expected);

        ResponseEntity<List<UsuarioDTO.Response>> result = usuarioController.obtenerTodos();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(expected, result.getBody());
    }

    @Test
    void crearUsuario() {
        UsuarioDTO.CrearUsuarioRequest request = new UsuarioDTO.CrearUsuarioRequest();
        UsuarioDTO.Response response = new UsuarioDTO.Response();
        when(usuarioService.crearUsuario(request)).thenReturn(response);

        ResponseEntity<UsuarioDTO.Response> result = usuarioController.crearUsuario(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void obtenerPerfil() {
        UsuarioDTO.PerfilResponse response = new UsuarioDTO.PerfilResponse();
        when(usuarioService.obtenerPerfil()).thenReturn(response);

        ResponseEntity<UsuarioDTO.PerfilResponse> result = usuarioController.obtenerPerfil();

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void obtenerPorId() {
        UsuarioDTO.Response response = new UsuarioDTO.Response();
        when(usuarioService.obtenerPorId(12L)).thenReturn(response);

        ResponseEntity<UsuarioDTO.Response> result = usuarioController.obtenerPorId(12L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void actualizarPerfil() {
        UsuarioDTO.ActualizarPerfilRequest request = new UsuarioDTO.ActualizarPerfilRequest();
        UsuarioDTO.PerfilResponse response = new UsuarioDTO.PerfilResponse();
        when(usuarioService.actualizarPerfil(request)).thenReturn(response);

        ResponseEntity<UsuarioDTO.PerfilResponse> result = usuarioController.actualizarPerfil(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        assertEquals(response, result.getBody());
    }

    @Test
    void cambiarContraseña() {
        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();

        ResponseEntity<?> result = usuarioController.cambiarContraseña(request);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        verify(usuarioService).cambiarContraseña(request);
        assertTrue(result.getBody() instanceof UsuarioController.MensajeResponse);
        assertEquals("Contraseña cambiada exitosamente", ((UsuarioController.MensajeResponse) result.getBody()).mensaje);
    }

    @Test
    void eliminarUsuario() {
        ResponseEntity<?> result = usuarioController.eliminarUsuario(12L);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode().value());
        verify(usuarioService).eliminarUsuario(12L);
        assertTrue(result.getBody() instanceof UsuarioController.MensajeResponse);
        assertEquals("Usuario eliminado exitosamente", ((UsuarioController.MensajeResponse) result.getBody()).mensaje);
    }
}
