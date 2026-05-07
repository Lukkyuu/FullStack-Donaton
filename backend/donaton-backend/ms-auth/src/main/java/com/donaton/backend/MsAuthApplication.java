package com.donaton.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.donaton.backend"})
public class MsAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsAuthApplication.class, args);
    }
}
