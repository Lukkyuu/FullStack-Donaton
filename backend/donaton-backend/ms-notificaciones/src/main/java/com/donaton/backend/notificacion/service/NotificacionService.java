package com.donaton.backend.notificacion.service;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.repository.UsuarioRepository;
import com.donaton.backend.notificacion.dto.NotificacionDTO;
import com.donaton.backend.notificacion.model.Notificacion;
import com.donaton.backend.notificacion.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final Map<Long, NotificacionDTO.PreferenciasResponse> preferencias = new HashMap<>();

    public List<NotificacionDTO.Response> obtenerMisNotificaciones() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        return notificacionRepository.findByUsuarioId(usuario.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NotificacionDTO.Response> obtenerNoLeidas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        return notificacionRepository.findByUsuarioIdAndLeida(usuario.getId(), false)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id).orElseThrow();
        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    public void establecerPreferencias(Long usuarioId, NotificacionDTO.PreferenciasRequest request) {
        NotificacionDTO.PreferenciasResponse prefs = NotificacionDTO.PreferenciasResponse.builder()
                .usuarioId(usuarioId)
                .recibirEmails(request.isRecibirEmails())
                .recibirSMS(request.isRecibirSMS())
                .recibirNotificaciones(request.isRecibirNotificaciones())
                .build();
        
        preferencias.put(usuarioId, prefs);
    }

    public NotificacionDTO.PreferenciasResponse obtenerPreferencias(Long usuarioId) {
        return preferencias.getOrDefault(usuarioId, NotificacionDTO.PreferenciasResponse.builder()
                .usuarioId(usuarioId)
                .recibirEmails(true)
                .recibirSMS(true)
                .recibirNotificaciones(true)
                .build());
    }

    private NotificacionDTO.Response toResponse(Notificacion n) {
        return NotificacionDTO.Response.builder()
                .id(n.getId())
                .tipo(n.getTipo())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .leida(n.isLeida())
                .fechaCreacion(n.getFechaCreacion())
                .build();
    }
}
