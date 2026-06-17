package com.donaton.backend.donacion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.messaging.DonacionPublisher;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;
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
class DonacionServiceTest {

    @Mock
    private DonacionRepository donacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CentroAcopioRepository centroAcopioRepository;

    @Mock
    private DonacionPublisher donacionPublisher;

    @InjectMocks
    private DonacionService donacionService;

    private Usuario mockDonante;
    private SecurityContext previousContext;

    @BeforeEach
    void setUp() {
        previousContext = SecurityContextHolder.getContext();
        mockDonante = Usuario.builder()
                .id(3L)
                .email("donante@donaton.cl")
                .nombre("Juan Pérez")
                .rol(Usuario.Rol.DONANTE)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(previousContext);
    }

    @Test
    void crearShouldSaveAndPublishDonation() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("donante@donaton.cl");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("donante@donaton.cl")).thenReturn(Optional.of(mockDonante));

        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setDescripcion("Ropa de abrigo");
        request.setTipoDonacion("ROPA");
        request.setUnidad("cajas");
        request.setZona("Valparaíso");
        request.setCantidad(5);

        DonacionDTO.Response response = donacionService.crear(request);

        assertNotNull(response);
        assertEquals("PENDIENTE", response.getEstado());
        assertEquals("Ropa de abrigo", response.getDescripcion());
        assertEquals("Juan Pérez", response.getDonanteNombre());

        verify(donacionRepository).save(any(Donacion.class));
        verify(donacionPublisher).publicarDonacion(any(DonacionDTO.Response.class));
    }

    @Test
    void listarTodasShouldMergeMockAndDbDonations() {
        Donacion dbDonation = Donacion.builder()
                .id(10L)
                .descripcion("Medicinas")
                .categoria("MEDICINA")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        when(donacionRepository.findAll()).thenReturn(List.of(dbDonation));

        List<DonacionDTO.Response> list = donacionService.listarTodas();

        assertNotNull(list);
        assertTrue(list.size() >= 3); // Mock list (2) + DB list (1)
        assertTrue(list.stream().anyMatch(d -> d.getId().equals(10L)));
    }

    @Test
    void obtenerPorIdShouldReturnCorrectDonation() {
        Donacion dbDonation = Donacion.builder()
                .id(15L)
                .descripcion("Comida")
                .categoria("ALIMENTO")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        when(donacionRepository.findById(15L)).thenReturn(Optional.of(dbDonation));

        DonacionDTO.Response response = donacionService.obtenerPorId(15L);

        assertNotNull(response);
        assertEquals(15L, response.getId());
        assertEquals("Comida", response.getDescripcion());
    }

    @Test
    void actualizarEstadoShouldChangeDonationState() {
        Donacion dbDonation = Donacion.builder()
                .id(1L)
                .descripcion("Frazadas")
                .categoria("ROPA")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        when(donacionRepository.findById(1L)).thenReturn(Optional.of(dbDonation));

        DonacionDTO.Response response = donacionService.actualizarEstado(1L, "ENTREGADA");

        assertNotNull(response);
        assertEquals("ENTREGADA", response.getEstado());
        verify(donacionRepository).save(dbDonation);
    }
}
