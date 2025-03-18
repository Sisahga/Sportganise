package com.sportganise.controllers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = HealthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class HealthControllerTest {

  @Autowired private MockMvc mockMvc;

  @Test
  public void ping() throws Exception {
    mockMvc.perform(MockMvcRequestBuilders.get("/api/health/ping")).andExpect(status().isOk());
  }
}
