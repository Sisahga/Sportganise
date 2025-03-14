package com.sportganise.controllers;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.notifications.NotificationRequestDto;
import com.sportganise.dto.notifications.StoreFcmTokenDto;
import com.sportganise.dto.notifications.UpdateNotificationMethodDto;
import com.sportganise.dto.notifications.UpdateNotificationPermissionDto;
import com.sportganise.services.notifications.FcmService;
import com.sportganise.services.notifications.NotificationsService;
import jakarta.validation.constraints.Null;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller class for sending notifications to devices. */
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
   * Send a notification to specific devices or a specific device.
   *
   * @param request contains the notification title & message, optional topic, & the users to
   *     notify.
   * @return a response entity with a success message.
   */
  @PostMapping("/send")
  public ResponseEntity<ResponseDto<Null>> sendNotificationToUser(
      @RequestBody NotificationRequestDto request) {
    notificationsService.sendNotificationToUser(request);
    return ResponseEntity.ok(new ResponseDto<>());
  }

  /**
   * Store the FCM token of a device.
   *
   * @param fcmTokenDto contains the account ID & the FCM token.
   * @return a response entity with a success message.
   */
  @PostMapping("/store-token")
  public ResponseEntity<ResponseDto<Null>> storeFcmToken(
      @RequestBody StoreFcmTokenDto fcmTokenDto) {
    fcmService.storeFcmToken(fcmTokenDto);
    return ResponseEntity.ok(new ResponseDto<>());
  }

  /**
   * Update the notification permission of a user.
   *
   * @param updateNotificationPermissionDto contains the account ID, the notification type, and the
   *     permission status (enabled/disabled).
   * @return a response entity with 200 OK if successful.
   */
  @PostMapping("/update-notification-permission")
  public ResponseEntity<ResponseDto<Null>> updateNotificationPermission(
      @RequestBody UpdateNotificationPermissionDto updateNotificationPermissionDto) {
    notificationsService.updateNotificationPermission(updateNotificationPermissionDto);
    return ResponseEntity.ok(new ResponseDto<>());
  }

  /**
   * Update the notification method of a user.
   *
   * @param updateNotificationMethodDto contains the account ID and the notification method.
   * @return a response entity with 200 OK if successful.
   */
  @PostMapping("/update-notification-method")
  public ResponseEntity<ResponseDto<Null>> updateNotificationMethod(
      @RequestBody UpdateNotificationMethodDto updateNotificationMethodDto) {
    notificationsService.updateNotificationMethod(updateNotificationMethodDto);
    return ResponseEntity.ok(new ResponseDto<>());
  }
}
