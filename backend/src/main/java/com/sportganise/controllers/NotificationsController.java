package com.sportganise.controllers;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.notifications.NotificationAlertsDto;
import com.sportganise.dto.notifications.NotificationRequestDto;
import com.sportganise.dto.notifications.NotificationSettingsDto;
import com.sportganise.dto.notifications.StoreFcmTokenDto;
import com.sportganise.dto.notifications.UpdateNotificationMethodDto;
import com.sportganise.dto.notifications.UpdateNotificationPermissionDto;
import com.sportganise.services.notifications.FcmService;
import com.sportganise.services.notifications.NotificationsService;
import jakarta.validation.constraints.Null;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    ResponseDto<Null> responseDto =
        ResponseDto.<Null>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Notification sent successfully.")
            .build();
    return ResponseEntity.ok(responseDto);
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
    ResponseDto<Null> responseDto =
        ResponseDto.<Null>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Token stored successfully.")
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Update the notification permission of a user.
   *
   * @param updateNotificationPermissionDto contains the account ID, the notification type, and the
   *     permission status (enabled/disabled).
   * @return a response entity with 200 OK if successful.
   */
  @PutMapping("/update-notification-permission")
  public ResponseEntity<ResponseDto<Null>> updateNotificationPermission(
      @RequestBody UpdateNotificationPermissionDto updateNotificationPermissionDto) {
    notificationsService.updateNotificationPermission(updateNotificationPermissionDto);
    ResponseDto<Null> responseDto =
        ResponseDto.<Null>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Notification permission successfully updated.")
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Update the notification method of a user.
   *
   * @param updateNotificationMethodDto contains the account ID and the notification method.
   * @return a response entity with 200 OK if successful.
   */
  @PutMapping("/update-notification-method")
  public ResponseEntity<ResponseDto<Null>> updateNotificationMethod(
      @RequestBody UpdateNotificationMethodDto updateNotificationMethodDto) {
    notificationsService.updateNotificationMethod(updateNotificationMethodDto);
    ResponseDto<Null> responseDto =
        ResponseDto.<Null>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Notification method successfully updated.")
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Get the notification settings of a user.
   *
   * @param userId Id of the user to get notification settings for.
   * @return a response entity with the notification settings and status 200 OK..
   */
  @GetMapping("/get-notif-settings/{userId}")
  public ResponseEntity<ResponseDto<NotificationSettingsDto>> getNotificationSettings(
      @PathVariable Integer userId) {
    NotificationSettingsDto notifSettings = notificationsService.getNotificationSettings(userId);
    ResponseDto<NotificationSettingsDto> response =
        ResponseDto.<NotificationSettingsDto>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Successfully retrieved notification settings.")
            .data(notifSettings)
            .build();
    return ResponseEntity.ok(response);
  }

  /**
   * Get the notification alerts of a user.
   *
   * @param userId Id of the user to get notification alerts for.
   * @return a response entity with the notification alerts and status 200 OK.
   */
  @GetMapping("/get-notif-alerts/{userId}")
  public ResponseEntity<ResponseDto<NotificationAlertsDto>> getNotificationAlerts(
      @PathVariable Integer userId) {
    NotificationAlertsDto notificationAlerts = notificationsService.getNotificationAlerts(userId);
    ResponseDto<NotificationAlertsDto> response =
        ResponseDto.<NotificationAlertsDto>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Successfully retrieved notification alerts.")
            .data(notificationAlerts)
            .build();
    return ResponseEntity.ok(response);
  }
}
