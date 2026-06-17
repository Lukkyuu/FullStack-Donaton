package com.donaton.backend.notificacion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.model.Notificacion;
import com.donaton.backend.notificacion.repository.NotificacionRepository;

class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NotificacionService notificacionService;

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
    void obtenerMisNotificacionesSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(99L).email("test@donaton.org").build();
        when(usuarioRepository.findByEmail("test@donaton.org")).thenReturn(Optional.of(user));

        Notificacion notif = Notificacion.builder().id(1L).tipo("TIPO").titulo("Titulo").mensaje("Mensaje").leida(false).build();
        when(notificacionRepository.findByUsuarioId(99L)).thenReturn(List.of(notif));

        List<NotificacionDTO.Response> results = notificacionService.obtenerMisNotificaciones();

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals("Titulo", results.get(0).getTitulo());
    }

    @Test
    void obtenerMisNotificacionesHandlesFailure() {
        SecurityContextHolder.clearContext();
        List<NotificacionDTO.Response> results = notificacionService.obtenerMisNotificaciones();
        assertTrue(results.isEmpty());
    }

    @Test
    void obtenerNoLeidasSuccess() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Usuario user = Usuario.builder().id(99L).email("test@donaton.org").build();
        when(usuarioRepository.findByEmail("test@donaton.org")).thenReturn(Optional.of(user));

        Notificacion notif = Notificacion.builder().id(1L).tipo("TIPO").titulo("Titulo").mensaje("Mensaje").leida(false).build();
        when(notificacionRepository.findByUsuarioIdAndLeida(99L, false)).thenReturn(List.of(notif));

        List<NotificacionDTO.Response> results = notificacionService.obtenerNoLeidas();

        assertFalse(results.isEmpty());
        assertFalse(results.get(0).isLeida());
    }

    @Test
    void obtenerNoLeidasHandlesFailure() {
        SecurityContextHolder.clearContext();
        List<NotificacionDTO.Response> results = notificacionService.obtenerNoLeidas();
        assertTrue(results.isEmpty());
    }

    @Test
    void marcarComoLeida() {
        Notificacion notif = Notificacion.builder().id(5L).leida(false).build();
        when(notificacionRepository.findById(5L)).thenReturn(Optional.of(notif));

        notificacionService.marcarComoLeida(5L);

        assertTrue(notif.isLeida());
        verify(notificacionRepository).save(notif);
    }

    @Test
    void marcarComoLeidaThrows() {
        when(notificacionRepository.findById(5L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> notificacionService.marcarComoLeida(5L));
    }

    @Test
    void establecerYObtenerPreferencias() {
        NotificacionDTO.PreferenciasRequest req = new NotificacionDTO.PreferenciasRequest();
        req.setRecibirEmails(false);
        req.setRecibirSMS(true);
        req.setRecibirNotificaciones(false);

        notificacionService.establecerPreferencias(88L, req);

        NotificacionDTO.PreferenciasResponse res = notificacionService.obtenerPreferencias(88L);
        assertNotNull(res);
        assertEquals(88L, res.getUsuarioId());
        assertFalse(res.isRecibirEmails());
        assertTrue(res.isRecibirSMS());
        assertFalse(res.isRecibirNotificaciones());

        // Default case
        NotificacionDTO.PreferenciasResponse def = notificacionService.obtenerPreferencias(999L);
        assertNotNull(def);
        assertTrue(def.isRecibirEmails());
    }

    @Test
    void preferenciasMapGetAndSave() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("prefs@donaton.org");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Map<String, Object> body = Map.of("email", false, "sms", true);
        notificacionService.guardarMisPreferenciasMap(body);

        Map<String, Object> result = notificacionService.obtenerMisPreferenciasMap();
        assertEquals(body, result);

        SecurityContextHolder.clearContext();
        Map<String, Object> anonymousPrefs = notificacionService.obtenerMisPreferenciasMap();
        assertNotNull(anonymousPrefs);
        assertTrue(anonymousPrefs.containsKey("canales"));
    }
}
