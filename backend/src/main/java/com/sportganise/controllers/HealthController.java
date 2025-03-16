package com.sportganise.controllers;

import com.sportganise.dto.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller providing minimal health check. */
@Slf4j
@RestController
@RequestMapping("api/health")
public class HealthController {
  @GetMapping("/ping")
  public ResponseEntity<ResponseDto<Void>> ping() {
    log.debug("Ping endpoint requested, status OK");
    return ResponseDto.ok(null, "Service is healthy");
  }
}
