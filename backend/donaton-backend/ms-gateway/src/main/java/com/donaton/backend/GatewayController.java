package com.donaton.backend;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GatewayController {

    @GetMapping({"/", "/health"})
    public Map<String, Object> root() {
        return Map.of(
                "service", "ms-gateway",
                "status", "ok",
                "message", "Donaton API Gateway is running",
                "routes", "/api/**");
    }
}