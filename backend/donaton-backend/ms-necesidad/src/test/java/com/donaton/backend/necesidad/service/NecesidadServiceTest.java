package com.donaton.backend.necesidad.service;

import static org.junit.jupiter.api.Assertions.*;
<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

=======
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
<<<<<<< HEAD
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
=======

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
class NecesidadServiceTest {

    @Mock
    private NecesidadRepository necesidadRepository;
<<<<<<< HEAD

=======
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NecesidadService necesidadService;

<<<<<<< HEAD
    private Usuario mockOrg;
    private SecurityContext previousContext;

    @BeforeEach
    void setUp() {
        previousContext = SecurityContextHolder.getContext();
        mockOrg = Usuario.builder()
                .id(2L)
                .email("ayuda@gmail.com")
                .nombre("Organización Ayuda")
                .rol(Usuario.Rol.ORGANIZACION)
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
    void crearShouldSaveAndReturnResponse() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("ayuda@gmail.com");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("ayuda@gmail.com")).thenReturn(Optional.of(mockOrg));

        NecesidadDTO.Request request = new NecesidadDTO.Request();
        request.setDescripcion("Necesidad de abrigo");
        request.setCategoria("ROPA");
        request.setUrgencia("ALTA");
        request.setUnidad("unidades");
        request.setZona("Santiago");
        request.setCantidadRequerida(100);
=======
        SecurityContextHolder.setContext(originalContext);
    }

    @Test
    void crearNecesidadWithAuthenticationAndDbSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("org@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(55L).nombre("Fundación Sol").email("org@donaton.org").build();
        when(usuarioRepository.findByEmail("org@donaton.org")).thenReturn(Optional.of(user));

        NecesidadDTO.Request request = new NecesidadDTO.Request();
        request.setDescripcion("Colchones");
        request.setCategoria("REFUGIO");
        request.setUrgencia("ALTA");
        request.setUnidad("unidades");
        request.setZona("Talca");
        request.setCantidadRequerida(30);
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

        NecesidadDTO.Response response = necesidadService.crear(request);

        assertNotNull(response);
<<<<<<< HEAD
        assertEquals("ACTIVA", response.getEstado());
        assertEquals("Organización Ayuda", response.getBeneficiarioNombre());

=======
        assertEquals("Fundación Sol", response.getBeneficiarioNombre());
        assertEquals("ACTIVA", response.getEstado());
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        verify(necesidadRepository).save(any(Necesidad.class));
    }

    @Test
<<<<<<< HEAD
    void listarActivasShouldMergeMockAndDbNeeds() {
        Necesidad dbNeed = Necesidad.builder()
                .id(20L)
                .descripcion("Insumos medicos")
                .categoria("MEDICINA")
                .estado(Necesidad.EstadoNecesidad.ACTIVA)
                .build();

        when(necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA)).thenReturn(List.of(dbNeed));

        List<NecesidadDTO.Response> list = necesidadService.listarActivas();

        assertNotNull(list);
        assertTrue(list.size() >= 5); // Mock list (4) + DB list (1)
        assertTrue(list.stream().anyMatch(n -> n.getId().equals(20L)));
    }

    @Test
    void obtenerPorIdShouldReturnCorrectNeed() {
        Necesidad dbNeed = Necesidad.builder()
                .id(25L)
                .descripcion("Agua")
                .categoria("ALIMENTO")
                .estado(Necesidad.EstadoNecesidad.ACTIVA)
                .build();

        when(necesidadRepository.findById(25L)).thenReturn(Optional.of(dbNeed));

        NecesidadDTO.Response response = necesidadService.obtenerPorId(25L);

        assertNotNull(response);
        assertEquals(25L, response.getId());
        assertEquals("Agua", response.getDescripcion());
    }

    @Test
    void actualizarEstadoShouldChangeNeedState() {
        Necesidad dbNeed = Necesidad.builder()
                .id(1L)
                .descripcion("Frazadas")
                .categoria("ROPA")
                .estado(Necesidad.EstadoNecesidad.ACTIVA)
                .build();

        when(necesidadRepository.findById(1L)).thenReturn(Optional.of(dbNeed));

        NecesidadDTO.Response response = necesidadService.actualizarEstado(1L, "SATISFECHA");

        assertNotNull(response);
        assertEquals("SATISFECHA", response.getEstado());
=======
    void crearNecesidadAnonymousFallback() {
        SecurityContextHolder.clearContext();

        NecesidadDTO.Request request = new NecesidadDTO.Request();
        request.setDescripcion("Dinero para remedios");
        request.setTipoNecesidad("DINERO");
        request.setCantidadRequerida(500000);

        NecesidadDTO.Response response = necesidadService.crear(request);

        assertNotNull(response);
        assertEquals("Fundación Demo", response.getBeneficiarioNombre());
    }

    @Test
    void listarActivasSuccessAndFailure() {
        Necesidad dbNeed = Necesidad.builder().id(200L).descripcion("Needs basic medicines").build();
        when(necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA)).thenReturn(List.of(dbNeed));

        List<NecesidadDTO.Response> list = necesidadService.listarActivas();
        assertFalse(list.isEmpty());
        assertTrue(list.stream().anyMatch(n -> n.getId().equals(200L)));

        when(necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA)).thenThrow(new RuntimeException("DB offline"));
        list = necesidadService.listarActivas();
        assertFalse(list.isEmpty()); // Should still contain mock values
    }

    @Test
    void listarPorBeneficiario() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("some-org@donaton.cl");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(9L).nombre("Some Org").email("some-org@donaton.cl").build();
        when(usuarioRepository.findByEmail("some-org@donaton.cl")).thenReturn(Optional.of(user));

        Necesidad dbNeed = Necesidad.builder().id(201L).beneficiario(user).descripcion("Need 201").build();
        when(necesidadRepository.findByBeneficiarioId(9L)).thenReturn(List.of(dbNeed));

        List<NecesidadDTO.Response> list = necesidadService.listarPorBeneficiario();
        assertFalse(list.isEmpty());
    }

    @Test
    void obtenerPorId() {
        Necesidad dbNeed = Necesidad.builder().id(500L).descripcion("Need 500").build();
        when(necesidadRepository.findById(500L)).thenReturn(Optional.of(dbNeed));

        NecesidadDTO.Response response = necesidadService.obtenerPorId(500L);
        assertEquals("Need 500", response.getDescripcion());

        NecesidadDTO.Response responseMock = necesidadService.obtenerPorId(1L);
        assertEquals(1L, responseMock.getId());

        assertThrows(RuntimeException.class, () -> necesidadService.obtenerPorId(9999L));
    }

    @Test
    void testDatabaseConnectionStatus() {
        when(usuarioRepository.count()).thenReturn(10L);
        when(necesidadRepository.count()).thenReturn(5L);

        Map<String, Object> report = necesidadService.testDatabaseConnection();
        assertEquals("UP", report.get("status"));
        assertEquals(10L, report.get("usersCount"));

        when(usuarioRepository.count()).thenThrow(new RuntimeException("DB bad query"));
        report = necesidadService.testDatabaseConnection();
        assertEquals("DOWN", report.get("status"));
    }

    @Test
    void actualizarNecesidad() {
        NecesidadDTO.Request request = new NecesidadDTO.Request();
        request.setDescripcion("Updated need description");
        request.setCantidadRequerida(80);

        Necesidad dbNeed = Necesidad.builder().id(2L).descripcion("Old description").build();
        when(necesidadRepository.findById(2L)).thenReturn(Optional.of(dbNeed));

        NecesidadDTO.Response updated = necesidadService.actualizar(2L, request);

        assertEquals("Updated need description", updated.getDescripcion());
        assertEquals(80, updated.getCantidadRequerida());
        verify(necesidadRepository).save(dbNeed);
    }

    @Test
    void actualizarEstado() {
        Necesidad dbNeed = Necesidad.builder().id(3L).estado(Necesidad.EstadoNecesidad.ACTIVA).build();
        when(necesidadRepository.findById(3L)).thenReturn(Optional.of(dbNeed));

        NecesidadDTO.Response response = necesidadService.actualizarEstado(3L, "CANCELADA");

        assertEquals("CANCELADA", response.getEstado());
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        verify(necesidadRepository).save(dbNeed);
    }
}
