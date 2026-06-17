package com.donaton.backend.donacion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
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

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.messaging.DonacionPublisher;
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;

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

    private SecurityContext originalContext;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        originalContext = SecurityContextHolder.getContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(originalContext);
    }

    @Test
    void crearDonacionWithSecurityContextAndDbFailure() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test-donante@donaton.cl");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(10L).nombre("Juan Donante").email("test-donante@donaton.cl").build();
        CentroAcopio centro = CentroAcopio.builder().id(5L).nombre("Centro Test").build();

        when(usuarioRepository.findByEmail("test-donante@donaton.cl")).thenReturn(Optional.of(user));
        when(centroAcopioRepository.findById(5L)).thenReturn(Optional.of(centro));
        when(donacionRepository.save(any(Donacion.class))).thenThrow(new RuntimeException("DB offline"));

        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setCentroAcopioId(5L);
        request.setDescripcion("Frazadas");
        request.setCategoria("ROPA");
        request.setUnidad("piezas");
        request.setZona("RM");
        request.setCantidad(20);

        DonacionDTO.Response response = donacionService.crear(request);

        assertNotNull(response);
        assertEquals("Juan Donante", response.getDonanteNombre());
        assertEquals("Centro Test", response.getCentroAcopioNombre());
        assertEquals("PENDIENTE", response.getEstado());
        verify(donacionPublisher).publicarDonacion(any(DonacionDTO.Response.class));
    }

    @Test
    void crearDonacionAnonymousUser() {
        SecurityContextHolder.clearContext();

        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setCentroAcopioId(99L); // non-existent
        request.setDescripcion("Arroz");
        request.setTipoDonacion("ALIMENTO");
        request.setCantidad(10);

        DonacionDTO.Response response = donacionService.crear(request);

        assertNotNull(response);
        assertEquals("Juan Pérez (Donante)", response.getDonanteNombre()); // defaults because "donante@donaton.cl" contains donante
        assertEquals("Centro de Acopio #99", response.getCentroAcopioNombre());
        verify(donacionPublisher).publicarDonacion(any(DonacionDTO.Response.class));
    }

    @Test
    void listarTodasMergesDbAndMock() {
        Donacion dbDonation = Donacion.builder()
                .id(1001L)
                .descripcion("DB Donacion")
                .estado(Donacion.EstadoDonacion.ENTREGADA)
                .build();
        when(donacionRepository.findAll()).thenReturn(List.of(dbDonation));

        List<DonacionDTO.Response> results = donacionService.listarTodas();

        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(d -> d.getId().equals(1001L)));
        assertTrue(results.stream().anyMatch(d -> d.getId().equals(1L))); // from static mock list
    }

    @Test
    void listarTodasHandlesExceptionAndReturnsOnlyMock() {
        when(donacionRepository.findAll()).thenThrow(new RuntimeException("DB Error"));

        List<DonacionDTO.Response> results = donacionService.listarTodas();

        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(d -> d.getId().equals(1L)));
    }

    @Test
    void listarPorDonanteWithSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("pepe@donaton.cl");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(22L).nombre("Pepe").email("pepe@donaton.cl").build();
        when(usuarioRepository.findByEmail("pepe@donaton.cl")).thenReturn(Optional.of(user));

        Donacion dbDonation = Donacion.builder()
                .id(1002L)
                .donante(user)
                .descripcion("Pepe donation")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();
        when(donacionRepository.findByDonanteId(22L)).thenReturn(List.of(dbDonation));

        List<DonacionDTO.Response> results = donacionService.listarPorDonante();
        assertFalse(results.isEmpty());
    }

    @Test
    void obtenerPorIdFromDbAndFallback() {
        // From DB
        Donacion dbDonation = Donacion.builder().id(999L).descripcion("In DB").build();
        when(donacionRepository.findById(999L)).thenReturn(Optional.of(dbDonation));

        DonacionDTO.Response response = donacionService.obtenerPorId(999L);
        assertEquals("In DB", response.getDescripcion());

        // From MOCK list (id = 1L)
        DonacionDTO.Response responseMock = donacionService.obtenerPorId(1L);
        assertEquals("Caja de alimentos no perecibles", responseMock.getDescripcion());

        // Not Found
        assertThrows(RuntimeException.class, () -> donacionService.obtenerPorId(99999L));
    }

    @Test
    void actualizarDonacionSuccess() {
        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setDescripcion("Updated Description");
        request.setCantidad(99);

        Donacion dbDonation = Donacion.builder().id(2L).descripcion("Maria's").build();
        when(donacionRepository.findById(2L)).thenReturn(Optional.of(dbDonation));

        DonacionDTO.Response updated = donacionService.actualizar(2L, request);

        assertEquals("Updated Description", updated.getDescripcion());
        assertEquals(99, updated.getCantidad());
        verify(donacionRepository).save(dbDonation);
    }

    @Test
    void cancelarAndActualizarEstado() {
        Donacion dbDonation = Donacion.builder().id(1L).estado(Donacion.EstadoDonacion.PENDIENTE).build();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(dbDonation));

        DonacionDTO.Response canceled = donacionService.cancelar(1L);
        assertEquals("CANCELADA", canceled.getEstado());
        verify(donacionRepository).save(dbDonation);

        DonacionDTO.Response stateUpdated = donacionService.actualizarEstado(1L, "APROBADO");
        assertEquals("APROBADO", stateUpdated.getEstado());
    }
}
