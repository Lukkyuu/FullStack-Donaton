package com.donaton.backend.service;

import com.donaton.backend.dto.NecesidadDTO;
import com.donaton.backend.model.Necesidad;
import com.donaton.backend.model.Usuario;
import com.donaton.backend.repository.NecesidadRepository;
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
class NecesidadServiceTest {

    @Mock private NecesidadRepository necesidadRepository;
    @Mock private UsuarioRepository usuarioRepository;

    @InjectMocks private NecesidadService necesidadService;

    private Usuario beneficiario;
    private Necesidad necesidad;

    @BeforeEach
    void setUp() {
        beneficiario = Usuario.builder().id(1L).email("benef@test.com")
                .nombre("Beneficiario Test").rol(Usuario.Rol.BENEFICIARIO).build();

        necesidad = Necesidad.builder().id(1L).beneficiario(beneficiario)
                .descripcion("Necesito ropa").categoria("Vestimenta")
                .cantidadRequerida(5).estado(Necesidad.EstadoNecesidad.ACTIVA)
                .fechaCreacion(LocalDateTime.now()).build();

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("benef@test.com");
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @Test
    void crear_necesidadValida_retornaResponse() {
        when(usuarioRepository.findByEmail("benef@test.com")).thenReturn(Optional.of(beneficiario));
        when(necesidadRepository.save(any(Necesidad.class))).thenReturn(necesidad);

        NecesidadDTO.Response response = necesidadService.crear(
                new NecesidadDTO.Request("Necesito ropa", "Vestimenta", 5));

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDescripcion()).isEqualTo("Necesito ropa");
        assertThat(response.getEstado()).isEqualTo("ACTIVA");
        assertThat(response.getBeneficiarioNombre()).isEqualTo("Beneficiario Test");
    }

    @Test
    void listarActivas_retornaSoloNecesidadesActivas() {
        when(necesidadRepository.findByEstado(Necesidad.EstadoNecesidad.ACTIVA))
                .thenReturn(List.of(necesidad));

        List<NecesidadDTO.Response> result = necesidadService.listarActivas();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEstado()).isEqualTo("ACTIVA");
    }

    @Test
    void listarPorBeneficiario_retornaSoloPropias() {
        when(usuarioRepository.findByEmail("benef@test.com")).thenReturn(Optional.of(beneficiario));
        when(necesidadRepository.findByBeneficiarioId(1L)).thenReturn(List.of(necesidad));

        List<NecesidadDTO.Response> result = necesidadService.listarPorBeneficiario();

        assertThat(result).hasSize(1);
        verify(necesidadRepository).findByBeneficiarioId(1L);
    }

    @Test
    void actualizarEstado_cambiaEstadoCorrectamente() {
        Necesidad satisfecha = Necesidad.builder().id(1L).beneficiario(beneficiario)
                .descripcion("Necesito ropa").estado(Necesidad.EstadoNecesidad.SATISFECHA)
                .fechaCreacion(LocalDateTime.now()).build();
        when(necesidadRepository.findById(1L)).thenReturn(Optional.of(necesidad));
        when(necesidadRepository.save(any())).thenReturn(satisfecha);

        NecesidadDTO.Response response = necesidadService.actualizarEstado(1L, "SATISFECHA");

        assertThat(response.getEstado()).isEqualTo("SATISFECHA");
    }

    @Test
    void actualizarEstado_estadoInvalido_lanzaExcepcion() {
        when(necesidadRepository.findById(1L)).thenReturn(Optional.of(necesidad));

        assertThatThrownBy(() -> necesidadService.actualizarEstado(1L, "ESTADO_INVALIDO"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
