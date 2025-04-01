package com.sportganise.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/** WebSocketConfig class is used to configure the WebSocket server. */
@Slf4j
@EnableWebSocketMessageBroker
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  public WebSocketConfig() {
    log.info("WebSocketConfig class loaded");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
        .addEndpoint("/ws")
        .setAllowedOrigins(
            "http://localhost:3000", // Frontend server
            "http://localhost:5173", // Frontend running locally
            "https://onibad.sportganise.com",
            "http://localhost",
                "capacitor://localhost")
        .withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/directmessage");
    registry.setApplicationDestinationPrefixes("/app");
  }
}
