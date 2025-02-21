package com.sportganise.controllers;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.firebaseFcm.NotificationRequest;
import com.sportganise.services.firebaseFcm.FcmService;
import jakarta.validation.constraints.Null;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for sending notifications to devices.
 */
@RestController
@RequestMapping("api/notifications")
public class NotificationsController {
  private final FcmService fcmService;
  public NotificationsController(FcmService fcmService) {
    this.fcmService = fcmService;
  }

  /**
   * Send a notification to a specific device.
   *
   * @param request contains the notification title & message, optional topic, & the target device token.
   * @return a response entity with a success message.
   */
  @PostMapping("/send")
  public ResponseEntity<ResponseDto<Null>> sendNotification(@RequestBody NotificationRequest request) {
    fcmService.sendMessageToToken(request);
    return ResponseEntity.ok(new ResponseDto<>());
  }
}
