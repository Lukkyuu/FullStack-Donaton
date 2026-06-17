package com.donaton.backend.usuario.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.usuario.dto.UsuarioDTO;
import com.donaton.backend.usuario.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
    }

    @Test
    void obtenerTodosShouldReturnList() throws Exception {
        UsuarioDTO.Response mockResponse = UsuarioDTO.Response.builder()
                .id(1L)
                .email("admin@donaton.org")
                .nombre("Admin")
                .rol("ADMIN")
                .build();

        when(usuarioService.obtenerTodos()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].email").value("admin@donaton.org"));
    }

    @Test
    void obtenerPorIdShouldReturnUser() throws Exception {
        UsuarioDTO.Response mockResponse = UsuarioDTO.Response.builder()
                .id(2L)
                .email("user@donaton.org")
                .nombre("User")
                .rol("DONANTE")
                .build();

        when(usuarioService.obtenerPorId(2L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/usuarios/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.email").value("user@donaton.org"));
    }

    @Test
    void crearUsuarioShouldReturnUser() throws Exception {
        UsuarioDTO.CrearUsuarioRequest request = new UsuarioDTO.CrearUsuarioRequest();
        request.setEmail("user@donaton.org");
        request.setPassword("password123");
        request.setNombre("User Name");
        request.setRole("DONANTE");

        UsuarioDTO.Response mockResponse = UsuarioDTO.Response.builder()
                .id(3L)
                .email("user@donaton.org")
                .nombre("User Name")
                .rol("DONANTE")
                .build();

        when(usuarioService.crearUsuario(any(UsuarioDTO.CrearUsuarioRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L))
                .andExpect(jsonPath("$.email").value("user@donaton.org"));
    }

    @Test
    void obtenerPerfilShouldReturnPerfil() throws Exception {
        UsuarioDTO.PerfilResponse mockPerfil = UsuarioDTO.PerfilResponse.builder()
                .id(4L)
                .email("profile@donaton.org")
                .nombre("Profile User")
                .rol("DONANTE")
                .build();

        when(usuarioService.obtenerPerfil()).thenReturn(mockPerfil);

        mockMvc.perform(get("/api/usuarios/perfil"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("profile@donaton.org"));
    }

    @Test
    void actualizarPerfilShouldReturnUpdatedPerfil() throws Exception {
        UsuarioDTO.ActualizarPerfilRequest request = new UsuarioDTO.ActualizarPerfilRequest();
        request.setNombre("Updated User");

        UsuarioDTO.PerfilResponse mockPerfil = UsuarioDTO.PerfilResponse.builder()
                .id(4L)
                .email("profile@donaton.org")
                .nombre("Updated User")
                .rol("DONANTE")
                .build();

        when(usuarioService.actualizarPerfil(any(UsuarioDTO.ActualizarPerfilRequest.class))).thenReturn(mockPerfil);

        mockMvc.perform(put("/api/usuarios/perfil")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Updated User"));
    }

    @Test
    void cambiarContraseñaShouldReturnSuccessMessage() throws Exception {
        UsuarioDTO.CambiarContraseñaRequest request = new UsuarioDTO.CambiarContraseñaRequest();
        request.setContraseñaActual("oldPassword123");
        request.setContraseñaNueva("newPassword123");

        mockMvc.perform(post("/api/usuarios/cambiar-contraseña")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Contraseña cambiada exitosamente"));

        verify(usuarioService).cambiarContraseña(any(UsuarioDTO.CambiarContraseñaRequest.class));
    }

    @Test
    void eliminarUsuarioShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(delete("/api/usuarios/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Usuario eliminado exitosamente"));

        verify(usuarioService).eliminarUsuario(5L);
    }
}
