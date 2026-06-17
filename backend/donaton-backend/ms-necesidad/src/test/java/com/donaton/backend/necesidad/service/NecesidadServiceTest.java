package com.donaton.backend.necesidad.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.necesidad.dto.NecesidadDTO;
import com.donaton.backend.necesidad.model.Necesidad;
import com.donaton.backend.necesidad.repository.NecesidadRepository;
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
class NecesidadServiceTest {

    @Mock
    private NecesidadRepository necesidadRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NecesidadService necesidadService;

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
    }

    @AfterEach
    void tearDown() {
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

        NecesidadDTO.Response response = necesidadService.crear(request);

        assertNotNull(response);
        assertEquals("ACTIVA", response.getEstado());
        assertEquals("Organización Ayuda", response.getBeneficiarioNombre());

        verify(necesidadRepository).save(any(Necesidad.class));
    }

    @Test
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
        verify(necesidadRepository).save(dbNeed);
    }
}
