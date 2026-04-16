package com.donaton.backend.service;

import com.donaton.backend.dto.DonacionDTO;
import com.donaton.backend.messaging.DonacionPublisher;
import com.donaton.backend.model.CentroAcopio;
import com.donaton.backend.model.Donacion;
import com.donaton.backend.model.Usuario;
import com.donaton.backend.repository.CentroAcopioRepository;
import com.donaton.backend.repository.DonacionRepository;
import com.donaton.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonacionServiceTest {

    @Mock private DonacionRepository donacionRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private CentroAcopioRepository centroAcopioRepository;
    @Mock private DonacionPublisher donacionPublisher;

    @InjectMocks private DonacionService donacionService;

    private Usuario donante;
    private CentroAcopio centro;
    private Donacion donacion;

    @BeforeEach
    void setUp() {
        donante = Usuario.builder().id(1L).email("donante@test.com")
                .nombre("Donante Test").rol(Usuario.Rol.DONANTE).build();

        centro = CentroAcopio.builder().id(1L).nombre("Centro Norte")
                .direccion("Calle 1").activo(true).build();

        donacion = Donacion.builder().id(1L).donante(donante).centroAcopio(centro)
                .descripcion("Ropa").categoria("Vestimenta").cantidad(10)
                .estado(Donacion.EstadoDonacion.PENDIENTE)
                .fechaCreacion(LocalDateTime.now()).build();

        mockSecurityContext("donante@test.com");
    }

    private void mockSecurityContext(String email) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @Test
    void crear_donacionValida_retornaResponse() {
        when(usuarioRepository.findByEmail("donante@test.com")).thenReturn(Optional.of(donante));
        when(centroAcopioRepository.findById(1L)).thenReturn(Optional.of(centro));
        when(donacionRepository.save(any(Donacion.class))).thenReturn(donacion);

        DonacionDTO.Response response = donacionService.crear(
                new DonacionDTO.Request(1L, "Ropa", "Vestimenta", 10));

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDescripcion()).isEqualTo("Ropa");
        assertThat(response.getEstado()).isEqualTo("PENDIENTE");
        assertThat(response.getDonanteNombre()).isEqualTo("Donante Test");
        verify(donacionPublisher).publicarDonacion(any());
    }

    @Test
    void crear_sinCentroAcopio_creaIgual() {
        Donacion sinCentro = Donacion.builder().id(2L).donante(donante)
                .descripcion("Comida").estado(Donacion.EstadoDonacion.PENDIENTE)
                .fechaCreacion(LocalDateTime.now()).build();
        when(usuarioRepository.findByEmail("donante@test.com")).thenReturn(Optional.of(donante));
        when(donacionRepository.save(any())).thenReturn(sinCentro);

        DonacionDTO.Response response = donacionService.crear(
                new DonacionDTO.Request(null, "Comida", "Alimentos", 5));

        assertThat(response.getCentroAcopioNombre()).isNull();
        verify(centroAcopioRepository, never()).findById(any());
    }

    @Test
    void listarTodas_retornaTodasLasDonaciones() {
        when(donacionRepository.findAll()).thenReturn(List.of(donacion));

        List<DonacionDTO.Response> result = donacionService.listarTodas();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescripcion()).isEqualTo("Ropa");
    }

    @Test
    void listarPorDonante_retornaSoloDonacionesDelUsuario() {
        when(usuarioRepository.findByEmail("donante@test.com")).thenReturn(Optional.of(donante));
        when(donacionRepository.findByDonanteId(1L)).thenReturn(List.of(donacion));

        List<DonacionDTO.Response> result = donacionService.listarPorDonante();

        assertThat(result).hasSize(1);
        verify(donacionRepository).findByDonanteId(1L);
    }

    @Test
    void actualizarEstado_estadoValido_actualizaCorrectamente() {
        Donacion actualizada = Donacion.builder().id(1L).donante(donante)
                .descripcion("Ropa").estado(Donacion.EstadoDonacion.ENTREGADA)
                .fechaCreacion(LocalDateTime.now()).build();
        when(donacionRepository.findById(1L)).thenReturn(Optional.of(donacion));
        when(donacionRepository.save(any())).thenReturn(actualizada);

        DonacionDTO.Response response = donacionService.actualizarEstado(1L, "ENTREGADA");

        assertThat(response.getEstado()).isEqualTo("ENTREGADA");
    }

    @Test
    void actualizarEstado_idInexistente_lanzaExcepcion() {
        when(donacionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> donacionService.actualizarEstado(99L, "ENTREGADA"))
                .isInstanceOf(RuntimeException.class);
    }
}
