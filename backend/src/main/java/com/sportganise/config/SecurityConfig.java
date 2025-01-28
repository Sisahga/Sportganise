package com.sportganise.config;

import lombok.RequiredArgsConstructor;
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
            new JwtAuthFilter(userAuthProvider), UsernamePasswordAuthenticationFilter.class)
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            request ->
                request
                    .requestMatchers(
                        "/api/auth/**",
                        "/login",
                        "/signup",
                        "/verificationcode",
                        "/error",
                        "/ws/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .build();
  }
}
