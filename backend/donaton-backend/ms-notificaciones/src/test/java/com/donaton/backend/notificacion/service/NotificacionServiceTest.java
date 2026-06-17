package com.donaton.backend.notificacion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.model.Notificacion;
import com.donaton.backend.notificacion.repository.NotificacionRepository;
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
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    private Usuario mockUser;
    private Notificacion mockNotif;
    private SecurityContext previousContext;

    @BeforeEach
    void setUp() {
        previousContext = SecurityContextHolder.getContext();
        mockUser = Usuario.builder()
                .id(1L)
                .email("user@donaton.org")
                .nombre("Test User")
                .rol(Usuario.Rol.DONANTE)
                .build();

        mockNotif = Notificacion.builder()
                .id(10L)
                .usuario(mockUser)
                .titulo("Test Titulo")
                .mensaje("Test Mensaje")
                .leida(false)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(previousContext);
    }

    @Test
    void obtenerMisNotificacionesShouldReturnList() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("user@donaton.org");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(mockUser));
        when(notificacionRepository.findByUsuarioId(1L)).thenReturn(List.of(mockNotif));

        List<NotificacionDTO.Response> result = notificacionService.obtenerMisNotificaciones();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Titulo", result.get(0).getTitulo());
    }

    @Test
    void obtenerNoLeidasShouldReturnUnreadOnly() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("user@donaton.org");
        SecurityContextHolder.setContext(context);

        when(usuarioRepository.findByEmail("user@donaton.org")).thenReturn(Optional.of(mockUser));
        when(notificacionRepository.findByUsuarioIdAndLeida(1L, false)).thenReturn(List.of(mockNotif));

        List<NotificacionDTO.Response> result = notificacionService.obtenerNoLeidas();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertFalse(result.get(0).isLeida());
    }

    @Test
    void marcarComoLeidaShouldUpdateState() {
        when(notificacionRepository.findById(10L)).thenReturn(Optional.of(mockNotif));

        notificacionService.marcarComoLeida(10L);

        assertTrue(mockNotif.isLeida());
        verify(notificacionRepository).save(mockNotif);
    }

    @Test
    void establecerYObtenerPreferenciasShouldWork() {
        NotificacionDTO.PreferenciasRequest request = new NotificacionDTO.PreferenciasRequest();
        request.setRecibirEmails(true);
        request.setRecibirSMS(false);
        request.setRecibirNotificaciones(true);

        notificacionService.establecerPreferencias(1L, request);
        NotificacionDTO.PreferenciasResponse prefs = notificacionService.obtenerPreferencias(1L);

        assertNotNull(prefs);
        assertEquals(1L, prefs.getUsuarioId());
        assertTrue(prefs.isRecibirEmails());
        assertFalse(prefs.isRecibirSMS());
        assertTrue(prefs.isRecibirNotificaciones());
    }
}
