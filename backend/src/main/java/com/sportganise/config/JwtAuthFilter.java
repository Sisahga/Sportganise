package com.sportganise.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JwtAuthFilter class is used to filter the request and validate the JWT token. For now we set the
 * websocket endpoint as public, to fix later.
 */
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

  private final UserAuthProvider userAuthProvider;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
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
    String[] publicEndpoints = {
      "/api/**",
      "/api/auth/login",
      "/api/auth/signup",
      "/login",
      "/signup",
      "/verificationcode",
      "/error",
      "/ws",
      "/ws/**"
    };
    String path = request.getRequestURI();

    for (String endpoint : publicEndpoints) {
      if (path.contains(endpoint)) {
        return true;
      }
    }
    return false;
  }
}
