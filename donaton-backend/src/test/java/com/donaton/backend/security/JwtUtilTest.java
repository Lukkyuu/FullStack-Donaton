package com.donaton.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret",
                "test_secret_key_must_be_at_least_32_chars_long!");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);

        userDetails = new User("usuario@test.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_DONANTE")));
    }

    @Test
    void generateToken_retornaTokenNoVacio() {
        String token = jwtUtil.generateToken(userDetails);

        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    void extractUsername_retornaEmailCorrecto() {
        String token = jwtUtil.generateToken(userDetails);

        String email = jwtUtil.extractUsername(token);

        assertThat(email).isEqualTo("usuario@test.com");
    }

    @Test
    void isTokenValid_tokenValido_retornaTrue() {
        String token = jwtUtil.generateToken(userDetails);

        assertThat(jwtUtil.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    void isTokenValid_tokenDeOtroUsuario_retornaFalse() {
        String token = jwtUtil.generateToken(userDetails);
        UserDetails otroUsuario = new User("otro@test.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_DONANTE")));

        assertThat(jwtUtil.isTokenValid(token, otroUsuario)).isFalse();
    }

    @Test
    void isTokenValid_tokenExpirado_retornaFalse() {
        JwtUtil jwtUtilExpirado = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtilExpirado, "secret",
                "test_secret_key_must_be_at_least_32_chars_long!");
        ReflectionTestUtils.setField(jwtUtilExpirado, "expiration", -1000L);

        String token = jwtUtilExpirado.generateToken(userDetails);

        assertThat(jwtUtilExpirado.isTokenValid(token, userDetails)).isFalse();
    }
}
