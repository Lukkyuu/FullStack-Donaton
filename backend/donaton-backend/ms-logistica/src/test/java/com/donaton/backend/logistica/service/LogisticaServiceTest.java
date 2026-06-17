package com.donaton.backend.logistica.service;

import static org.junit.jupiter.api.Assertions.*;
<<<<<<< HEAD
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

=======
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;
import com.donaton.backend.logistica.repository.DistribucionRepository;
import com.donaton.backend.logistica.repository.RecursoRepository;
<<<<<<< HEAD
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
=======

>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
class LogisticaServiceTest {

    @Mock
    private DonacionRepository donacionRepository;
<<<<<<< HEAD

    @Mock
    private CentroAcopioRepository centroAcopioRepository;

    @Mock
    private RecursoRepository recursoRepository;

=======
    @Mock
    private CentroAcopioRepository centroAcopioRepository;
    @Mock
    private RecursoRepository recursoRepository;
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
    @Mock
    private DistribucionRepository distribucionRepository;

    @InjectMocks
    private LogisticaService logisticaService;

<<<<<<< HEAD
    private Donacion mockDonacion;
    private CentroAcopio mockCentro;

    @BeforeEach
    void setUp() {
        mockDonacion = Donacion.builder()
                .id(1L)
                .descripcion("Frazadas")
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .build();

        mockCentro = CentroAcopio.builder()
                .id(2L)
                .nombre("Centro de Acopio Santiago")
                .activo(true)
                .build();
    }

    @Test
    void obtenerDonacionesPendientesShouldReturnFromRepository() {
        when(donacionRepository.findByEstado(Donacion.EstadoDonacion.PENDIENTE)).thenReturn(List.of(mockDonacion));

        List<Donacion> result = logisticaService.obtenerDonacionesPendientes();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void asignarCentroAcopioShouldUpdateDonationAndState() {
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(mockDonacion));
        when(centroAcopioRepository.findById(2L)).thenReturn(Optional.of(mockCentro));
        when(donacionRepository.save(any(Donacion.class))).thenAnswer(i -> i.getArguments()[0]);
=======
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerDonacionesPendientesSuccessAndFailure() {
        List<Donacion> expected = List.of(new Donacion());
        when(donacionRepository.findByEstado(Donacion.EstadoDonacion.PENDIENTE)).thenReturn(expected);

        List<Donacion> results = logisticaService.obtenerDonacionesPendientes();
        assertEquals(expected, results);

        when(donacionRepository.findByEstado(Donacion.EstadoDonacion.PENDIENTE)).thenThrow(new RuntimeException("DB error"));
        results = logisticaService.obtenerDonacionesPendientes();
        assertTrue(results.isEmpty());
    }

    @Test
    void asignarCentroAcopioSuccess() {
        Donacion donacion = new Donacion();
        CentroAcopio centro = new CentroAcopio();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(donacion));
        when(centroAcopioRepository.findById(2L)).thenReturn(Optional.of(centro));
        when(donacionRepository.save(any(Donacion.class))).thenReturn(donacion);
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d

        Donacion result = logisticaService.asignarCentroAcopio(1L, 2L);

        assertNotNull(result);
        assertEquals(Donacion.EstadoDonacion.EN_PROCESO, result.getEstado());
<<<<<<< HEAD
        assertEquals(mockCentro, result.getCentroAcopio());
        verify(donacionRepository).save(mockDonacion);
    }

    @Test
    void obtenerCentrosActivosShouldReturnFromRepository() {
        when(centroAcopioRepository.findByActivoTrue()).thenReturn(List.of(mockCentro));

        List<CentroAcopio> result = logisticaService.obtenerCentrosActivos();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(2L, result.get(0).getId());
    }

    @Test
    void marcarEntregadaShouldSetStateToEntregada() {
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(mockDonacion));
        when(donacionRepository.save(any(Donacion.class))).thenAnswer(i -> i.getArguments()[0]);

        Donacion result = logisticaService.marcarEntregada(1L);

        assertNotNull(result);
        assertEquals(Donacion.EstadoDonacion.ENTREGADA, result.getEstado());
        verify(donacionRepository).save(mockDonacion);
    }

    @Test
    void crearRecursoShouldSaveAndReturnRecurso() {
        Recurso recurso = new Recurso(null, "Agua", "ALIMENTO", 100.0, "litros", "Santiago");
        when(recursoRepository.save(any(Recurso.class))).thenAnswer(i -> i.getArguments()[0]);

        Recurso result = logisticaService.crearRecurso(recurso);

        assertNotNull(result);
        assertEquals("Agua", result.getNombre());
        assertNotNull(result.getId());
    }

    @Test
    void crearDistribucionShouldSaveAndReduceResourceQuantity() {
        Recurso recurso = new Recurso(10L, "Frazadas", "ROPA", 50.0, "unidades", "Santiago");
        Distribucion dist = new Distribucion(null, 10L, 1L, 10.0, "unidades", "Destino A", "Zona A", "EN_TRANSITO");

        when(recursoRepository.findById(10L)).thenReturn(Optional.of(recurso));
        when(distribucionRepository.save(any(Distribucion.class))).thenAnswer(i -> i.getArguments()[0]);

        Distribucion result = logisticaService.crearDistribucion(dist);

        assertNotNull(result);
        assertEquals(40.0, recurso.getCantidad()); // 50 - 10 = 40
        verify(recursoRepository).save(recurso);
=======
        assertEquals(centro, result.getCentroAcopio());
        verify(donacionRepository).save(donacion);
    }

    @Test
    void asignarCentroAcopioFailureFallback() {
        when(donacionRepository.findById(1L)).thenThrow(new RuntimeException("Not found"));

        Donacion result = logisticaService.asignarCentroAcopio(1L, 2L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(Donacion.EstadoDonacion.EN_PROCESO, result.getEstado());
    }

    @Test
    void obtenerCentrosActivosSuccessAndFailure() {
        List<CentroAcopio> expected = List.of(new CentroAcopio());
        when(centroAcopioRepository.findByActivoTrue()).thenReturn(expected);

        List<CentroAcopio> results = logisticaService.obtenerCentrosActivos();
        assertEquals(expected, results);

        when(centroAcopioRepository.findByActivoTrue()).thenThrow(new RuntimeException("DB error"));
        results = logisticaService.obtenerCentrosActivos();
        assertEquals(3, results.size());
    }

    @Test
    void marcarEntregadaSuccessAndFailure() {
        Donacion donacion = new Donacion();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(donacion));
        when(donacionRepository.save(any(Donacion.class))).thenReturn(donacion);

        Donacion result = logisticaService.marcarEntregada(1L);
        assertEquals(Donacion.EstadoDonacion.ENTREGADA, result.getEstado());

        when(donacionRepository.findById(1L)).thenThrow(new RuntimeException("DB error"));
        result = logisticaService.marcarEntregada(1L);
        assertEquals(Donacion.EstadoDonacion.ENTREGADA, result.getEstado());
    }

    @Test
    void obtenerRecursosSuccessAndFailure() {
        List<Recurso> expected = List.of(new Recurso());
        when(recursoRepository.findAll()).thenReturn(expected);

        List<Recurso> results = logisticaService.obtenerRecursos();
        assertEquals(expected, results);

        when(recursoRepository.findAll()).thenReturn(Collections.emptyList());
        results = logisticaService.obtenerRecursos();
        assertFalse(results.isEmpty()); // Should return static mocks

        when(recursoRepository.findAll()).thenThrow(new RuntimeException("DB error"));
        results = logisticaService.obtenerRecursos();
        assertFalse(results.isEmpty());
    }

    @Test
    void obtenerRecursoPorId() {
        Recurso expected = new Recurso();
        when(recursoRepository.findById(10L)).thenReturn(Optional.of(expected));

        Recurso result = logisticaService.obtenerRecursoPorId(10L);
        assertEquals(expected, result);

        when(recursoRepository.findById(1L)).thenReturn(Optional.empty());
        result = logisticaService.obtenerRecursoPorId(1L);
        assertEquals(1L, result.getId()); // static fallback
    }

    @Test
    void crearRecurso() {
        Recurso recurso = new Recurso();
        recurso.setId(null);
        recurso.setCantidad(50.0);

        when(recursoRepository.save(any(Recurso.class))).thenReturn(recurso);

        Recurso result = logisticaService.crearRecurso(recurso);

        assertNotNull(result.getId());
        verify(recursoRepository).save(recurso);
    }

    @Test
    void obtenerDistribucionesSuccessAndFailure() {
        List<Distribucion> expected = List.of(new Distribucion());
        when(distribucionRepository.findAll()).thenReturn(expected);

        List<Distribucion> results = logisticaService.obtenerDistribuciones();
        assertEquals(expected, results);

        when(distribucionRepository.findAll()).thenReturn(Collections.emptyList());
        results = logisticaService.obtenerDistribuciones();
        assertFalse(results.isEmpty());
    }

    @Test
    void obtenerDistribucionPorId() {
        Distribucion expected = new Distribucion();
        when(distribucionRepository.findById(10L)).thenReturn(Optional.of(expected));

        Distribucion result = logisticaService.obtenerDistribucionPorId(10L);
        assertEquals(expected, result);

        when(distribucionRepository.findById(1L)).thenReturn(Optional.empty());
        result = logisticaService.obtenerDistribucionPorId(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void crearDistribucionDeductsRecurso() {
        Distribucion dist = new Distribucion();
        dist.setRecursoId(2L); // matches frazadas (350.0 quantity)
        dist.setCantidad(50.0);

        when(distribucionRepository.save(any(Distribucion.class))).thenReturn(dist);

        Distribucion result = logisticaService.crearDistribucion(dist);

        assertNotNull(result.getId());
        verify(recursoRepository).save(argThat(recurso -> recurso.getId().equals(2L) && recurso.getCantidad() == 300.0));
>>>>>>> ab27ba8593ca528dd7d8b1dc2b9ec21aa96c741d
        verify(distribucionRepository).save(dist);
    }
}
