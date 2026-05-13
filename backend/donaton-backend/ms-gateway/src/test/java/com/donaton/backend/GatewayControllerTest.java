package com.donaton.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.GetMapping;

class GatewayControllerTest {

    private final GatewayController controller = new GatewayController();

    @Test
    void rootShouldExposeGatewayMetadata() {
        Map<String, Object> response = controller.root();

        assertEquals("ms-gateway", response.get("service"));
        assertEquals("ok", response.get("status"));
        assertEquals("Donaton API Gateway is running", response.get("message"));
        assertEquals("/api/**", response.get("routes"));
        assertTrue(response.size() >= 4);
    }

    @Test
    void rootShouldReturnAFreshImmutableMapEachTime() {
        Map<String, Object> firstResponse = controller.root();
        Map<String, Object> secondResponse = controller.root();

        assertNotSame(firstResponse, secondResponse);
        assertThrows(UnsupportedOperationException.class, () -> firstResponse.put("extra", "value"));
        assertEquals(firstResponse, secondResponse);
    }

    @Test
    void rootMethodShouldBeMappedToRootAndHealth() throws Exception {
        Method rootMethod = GatewayController.class.getDeclaredMethod("root");
        GetMapping getMapping = rootMethod.getAnnotation(GetMapping.class);

        assertTrue(getMapping != null);
        assertEquals(Set.of("/", "/health"), Set.of(getMapping.value()));
    }
}