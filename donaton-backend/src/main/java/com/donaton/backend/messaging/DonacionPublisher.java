package com.donaton.backend.messaging;

import com.donaton.backend.config.RabbitMQConfig;
import com.donaton.backend.dto.DonacionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DonacionPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publicarDonacion(DonacionDTO.Response donacion) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.DONACION_EXCHANGE,
                RabbitMQConfig.DONACION_ROUTING_KEY,
                donacion
        );
    }
}
