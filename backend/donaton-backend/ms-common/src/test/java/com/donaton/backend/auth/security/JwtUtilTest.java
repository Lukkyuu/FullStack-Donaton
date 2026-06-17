package com.donaton.backend.auth.security;

import com.donaton.backend.auth.model.Usuario;
import com.donaton.backend.auth.model.Usuario.Rol;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "donaton_secret_key_must_be_at_least_32_chars_long!");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    public void testGenerateAndExtractTokenUserDetails() {
        when(userDetails.getUsername()).thenReturn("user@donaton.cl");
        
        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(token);
        
        String extracted = jwtUtil.extractUsername(token);
        assertEquals("user@donaton.cl", extracted);
    }

    @Test
    public void testGenerateAndExtractTokenUsuario() {
        Usuario usuario = new Usuario();
        usuario.setEmail("admin@donaton.cl");
        usuario.setNombre("Admin");
        usuario.setRol(Rol.ADMIN);
        
        String token = jwtUtil.generateToken(usuario);
        assertNotNull(token);
        
        String extracted = jwtUtil.extractUsername(token);
        assertEquals("admin@donaton.cl", extracted);
    }

    @Test
    public void testIsTokenValid() {
        when(userDetails.getUsername()).thenReturn("user@donaton.cl");
        
        String token = jwtUtil.generateToken(userDetails);
        assertTrue(jwtUtil.isTokenValid(token, userDetails));
        
        UserDetails otherUser = mock(UserDetails.class);
        when(otherUser.getUsername()).thenReturn("other@donaton.cl");
        assertFalse(jwtUtil.isTokenValid(token, otherUser));
    }
}
