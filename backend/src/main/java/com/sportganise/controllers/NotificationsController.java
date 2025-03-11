package com.sportganise.controllers;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.fcm.NotificationRequestDto;
import com.sportganise.dto.fcm.StoreFcmTokenDto;
import com.sportganise.services.firebaseFcm.FcmService;
import com.sportganise.services.firebaseFcm.NotificationsService;
import jakarta.validation.constraints.Null;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for sending notifications to devices.
 */
@RestController
@RequestMapping("api/notifications")
public class NotificationsController {
  private final FcmService fcmService;
  private final NotificationsService notificationsService;
  public NotificationsController(FcmService fcmService, NotificationsService notificationsService) {
    this.fcmService = fcmService;
    this.notificationsService = notificationsService;
  }

  /**
   * Send a notification to a specific device.
   *
   * @param request contains the notification title & message, optional topic, & the target device token.
   * @param userId the ID of the user to send the notification to.
   * @return a response entity with a success message.
   */
  @PostMapping("/send/{userId}")
  public ResponseEntity<ResponseDto<Null>> sendNotificationToUser(
          @RequestBody NotificationRequestDto request, @PathVariable String userId) {
    notificationsService.sendNotificationToUser(request, Integer.parseInt(userId));
    return ResponseEntity.ok(new ResponseDto<>());
  }

  /**
   * Store the FCM token of a device.
   *
   * @param fcmTokenDto contains the account ID & the FCM token.
   * @return a response entity with a success message.
   */
  @PostMapping("/store-token")
  public ResponseEntity<ResponseDto<Null>> storeFcmToken(@RequestBody StoreFcmTokenDto fcmTokenDto) {
    fcmService.storeFcmToken(fcmTokenDto);
    return ResponseEntity.ok(new ResponseDto<>());
  }
}
