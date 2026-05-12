package com.donaton.backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String DONACION_QUEUE = "donacion.queue";
    public static final String DONACION_EXCHANGE = "donacion.exchange";
    public static final String DONACION_ROUTING_KEY = "donacion.routing.key";

    @Bean
    public Queue donacionQueue() {
        return new Queue(DONACION_QUEUE, true);
    }

    @Bean
    public DirectExchange donacionExchange() {
        return new DirectExchange(DONACION_EXCHANGE);
    }

    @Bean
    public Binding donacionBinding(Queue donacionQueue, DirectExchange donacionExchange) {
        return BindingBuilder.bind(donacionQueue).to(donacionExchange).with(DONACION_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
