package com.sportganise.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig class is used to configure the security of the application. Ensures all routes
 * except specified ones are authenticated.
 */
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
  private final UserAuthProvider userAuthProvider;

  @Value("${environment}")
  private String environment;

  /**
   * SecurityFilterChain method is used to configure the security of the application.
   *
   * @param http HttpSecurity
   * @return SecurityFilterChain
   * @throws Exception Unauthorized access
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.exceptionHandling(
            configurer -> configurer.authenticationEntryPoint(userAuthenticationEntryPoint))
        .addFilterBefore(
            new JwtAuthFilter(userAuthProvider, environment),
            UsernamePasswordAuthenticationFilter.class)
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            request -> {
              if (environment.equals("DEV")) {
                request.anyRequest().permitAll();
              } else {
                request
                    .requestMatchers("/api/auth/**", "/ws/**", "/ws")
                    .permitAll()
                    .anyRequest()
                    .authenticated();
              }
            })
        .build();
  }
}
