package com.donaton.backend.service;

import com.donaton.backend.model.CentroAcopio;
import com.donaton.backend.model.Donacion;
import com.donaton.backend.model.Usuario;
import com.donaton.backend.repository.CentroAcopioRepository;
import com.donaton.backend.repository.DonacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogisticaServiceTest {

    @Mock private DonacionRepository donacionRepository;
    @Mock private CentroAcopioRepository centroAcopioRepository;

    @InjectMocks private LogisticaService logisticaService;

    private Usuario donante;
    private CentroAcopio centro;
    private Donacion donacionPendiente;

    @BeforeEach
    void setUp() {
        donante = Usuario.builder().id(1L).nombre("Donante").build();
        centro = CentroAcopio.builder().id(1L).nombre("Centro Sur").activo(true).build();
        donacionPendiente = Donacion.builder().id(1L).donante(donante)
                .descripcion("Juguetes").estado(Donacion.EstadoDonacion.PENDIENTE)
                .fechaCreacion(LocalDateTime.now()).build();
    }

    @Test
    void obtenerDonacionesPendientes_retornaSoloPendientes() {
        when(donacionRepository.findByEstado(Donacion.EstadoDonacion.PENDIENTE))
                .thenReturn(List.of(donacionPendiente));

        List<Donacion> result = logisticaService.obtenerDonacionesPendientes();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEstado()).isEqualTo(Donacion.EstadoDonacion.PENDIENTE);
    }

    @Test
    void asignarCentroAcopio_asignaYCambiaEstadoAEnProceso() {
        Donacion asignada = Donacion.builder().id(1L).donante(donante).centroAcopio(centro)
                .descripcion("Juguetes").estado(Donacion.EstadoDonacion.EN_PROCESO)
                .fechaCreacion(LocalDateTime.now()).build();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(donacionPendiente));
        when(centroAcopioRepository.findById(1L)).thenReturn(Optional.of(centro));
        when(donacionRepository.save(any())).thenReturn(asignada);

        Donacion result = logisticaService.asignarCentroAcopio(1L, 1L);

        assertThat(result.getEstado()).isEqualTo(Donacion.EstadoDonacion.EN_PROCESO);
        assertThat(result.getCentroAcopio().getNombre()).isEqualTo("Centro Sur");
    }

    @Test
    void asignarCentroAcopio_donacionInexistente_lanzaExcepcion() {
        when(donacionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> logisticaService.asignarCentroAcopio(99L, 1L))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void obtenerCentrosActivos_retornaSoloActivos() {
        when(centroAcopioRepository.findByActivoTrue()).thenReturn(List.of(centro));

        List<CentroAcopio> result = logisticaService.obtenerCentrosActivos();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isActivo()).isTrue();
    }

    @Test
    void marcarEntregada_cambiaEstadoAEntregada() {
        Donacion entregada = Donacion.builder().id(1L).donante(donante)
                .descripcion("Juguetes").estado(Donacion.EstadoDonacion.ENTREGADA)
                .fechaCreacion(LocalDateTime.now()).build();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(donacionPendiente));
        when(donacionRepository.save(any())).thenReturn(entregada);

        Donacion result = logisticaService.marcarEntregada(1L);

        assertThat(result.getEstado()).isEqualTo(Donacion.EstadoDonacion.ENTREGADA);
    }
}
