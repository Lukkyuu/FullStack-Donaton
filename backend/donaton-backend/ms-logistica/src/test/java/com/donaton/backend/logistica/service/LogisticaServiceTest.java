package com.donaton.backend.logistica.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.donacion.model.Donacion;
import com.donaton.backend.donacion.repository.DonacionRepository;
import com.donaton.backend.logistica.model.CentroAcopio;
import com.donaton.backend.logistica.model.Distribucion;
import com.donaton.backend.logistica.model.Recurso;
import com.donaton.backend.logistica.repository.CentroAcopioRepository;
import com.donaton.backend.logistica.repository.DistribucionRepository;
import com.donaton.backend.logistica.repository.RecursoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class LogisticaServiceTest {

    @Mock
    private DonacionRepository donacionRepository;

    @Mock
    private CentroAcopioRepository centroAcopioRepository;

    @Mock
    private RecursoRepository recursoRepository;

    @Mock
    private DistribucionRepository distribucionRepository;

    @InjectMocks
    private LogisticaService logisticaService;

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

        Donacion result = logisticaService.asignarCentroAcopio(1L, 2L);

        assertNotNull(result);
        assertEquals(Donacion.EstadoDonacion.EN_PROCESO, result.getEstado());
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
        verify(distribucionRepository).save(dist);
    }
}
