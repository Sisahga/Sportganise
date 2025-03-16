package com.sportganise.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JwtAuthFilter class is used to filter the request and validate the JWT token. For now we set the
 * websocket endpoint as public, to fix later.
 */
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

  private final UserAuthProvider userAuthProvider;
  private final String environment;

  public JwtAuthFilter(UserAuthProvider userAuthProvider, String environment) {
    this.userAuthProvider = userAuthProvider;
    this.environment = environment;
  }

  private final String[] publicEndpoints = {
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/send-code",
    "/api/auth/verify-code",
    "/api/health/ping",
    "/ws",
    "/ws/**"
  };

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    log.info("CURRENT ENV: {}", environment);
    if ("DEV".equalsIgnoreCase(environment)) {
      log.info("DEV environment.");
      filterChain.doFilter(request, response);
      return;
    }

    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null) {
      log.info("Header exists.");
      String[] authContents = header.split(" ");
      if (authContents.length == 2 && authContents[0].equals("Bearer")) {
        try {
          SecurityContextHolder.getContext()
              .setAuthentication(userAuthProvider.validateToken(authContents[1]));
        } catch (Exception e) {
          SecurityContextHolder.clearContext();
          throw e;
        }
      }
    } else {
      log.info("Empty header request.");
      if (!isPublicEndpoint(request)) {
        log.info("PROTECTED ENDPOINT.");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  private boolean isPublicEndpoint(HttpServletRequest request) {
    String[] publicEndpoints = this.publicEndpoints;
    String path = request.getRequestURI();

    for (String endpoint : publicEndpoints) {
      if (path.contains(endpoint)) {
        return true;
      }
    }
    return false;
  }
}
