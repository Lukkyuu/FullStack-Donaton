package com.donaton.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.donaton.backend"})
public class MsDonacionApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsDonacionApplication.class, args);
    }
}
