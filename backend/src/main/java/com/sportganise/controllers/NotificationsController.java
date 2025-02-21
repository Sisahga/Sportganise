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

@RestController
@RequestMapping("api/notifications")
public class NotificationsController {
  private final FcmService fcmService;
  public NotificationsController(FcmService fcmService) {
    this.fcmService = fcmService;
  }

  @PostMapping("/send")
  public ResponseEntity<ResponseDto<Null>> sendNotification(@RequestBody NotificationRequest request) {
    fcmService.sendMessageToToken(request);
    return ResponseEntity.ok(new ResponseDto<>());
  }
}
