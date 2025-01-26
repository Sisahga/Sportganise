package com.sportganise.config;

import java.util.Arrays;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** WebConfig with CORS configuration. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  private static final Long MAX_AGE = 3600L;
  private static final int CORS_FILTER_ORDER = -100;

  /**
   * CORS filter configuration.
   *
   * @return FilterRegistrationBean with CORS configuration.
   */
  @Bean
  public FilterRegistrationBean<CorsFilter> corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("http://localhost:3000"); // Frontend sever
    config.addAllowedOrigin("http://localhost:5173"); // Frontend running locally
    config.addAllowedOrigin("http://localhost");
    config.addAllowedOrigin("https://onibad.sportganise.com");
    config.addAllowedHeader("*");
    config.setAllowedMethods(
        Arrays.asList(
            HttpMethod.GET.name(),
            HttpMethod.POST.name(),
            HttpMethod.PUT.name(),
            HttpMethod.PATCH.name(),
            HttpMethod.DELETE.name(),
            HttpMethod.OPTIONS.name()));
    config.setMaxAge(MAX_AGE);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    source.registerCorsConfiguration("/**", config);
    bean.setOrder(CORS_FILTER_ORDER);
    return bean;
  }
}
