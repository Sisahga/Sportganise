package com.sportganise.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.services.notifications.FcmService;
import com.sportganise.services.notifications.NotificationsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = NotificationsController.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc(addFilters = false)
public class NotificationsControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private NotificationsService notificationsService;
  @MockBean private FcmService fcmService;

  @Test
  void markAlertsRead_ShouldReturnSuccessMessage() throws Exception {
    Integer userId = 1;

    mockMvc
        .perform(
            put("/api/notifications/mark-alerts-read/{userId}", userId)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode").value(HttpStatus.OK.value()))
        .andExpect(jsonPath("$.message").value("Alerts marked as read."));

    verify(notificationsService, times(1)).markAlertsRead(userId);
  }
}
