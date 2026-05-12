package com.donaton.backend.donacion.messaging;

import com.donaton.backend.config.RabbitMQConfig;
import com.donaton.backend.donacion.dto.DonacionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DonacionConsumer {

    @RabbitListener(queues = RabbitMQConfig.DONACION_QUEUE)
    public void consumirDonacion(DonacionDTO.Response donacion) {
        log.info("Nueva donacion recibida: id={}, descripcion={}, estado={}",
                donacion.getId(), donacion.getDescripcion(), donacion.getEstado());
    }
}
