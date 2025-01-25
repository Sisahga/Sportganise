package com.sportganise.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/** WebConfig with CORS configuration. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

//  @Override
//  public void addCorsMappings(CorsRegistry registry) {
//    registry
//        .addMapping("/**")
//        .allowedOrigins("*")
//        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
//        .allowedHeaders("*")
//        .allowCredentials(true)
//        .maxAge(3600L);
//  }

  private static final Long MAX_AGE = 3600L;
  private static final int CORS_FILTER_ORDER = -100;

  @Bean
  public FilterRegistrationBean<CorsFilter> corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("http://localhost:3000");
    config.addAllowedHeader("*");
    config.setAllowedMethods(Arrays.asList(
            HttpMethod.GET.name(),
            HttpMethod.POST.name(),
            HttpMethod.PUT.name(),
            HttpMethod.PATCH.name(),
            HttpMethod.DELETE.name(),
            HttpMethod.OPTIONS.name()
    ));
    config.setMaxAge(MAX_AGE);
    source.registerCorsConfiguration("/**", config);
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(CORS_FILTER_ORDER);
    return bean;
  }
}
