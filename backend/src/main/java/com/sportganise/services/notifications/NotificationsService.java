package com.sportganise.services.notifications;

import com.sportganise.dto.notifications.*;
import com.sportganise.entities.notifications.NotificationPreference;
import com.sportganise.exceptions.notificationexceptions.SaveNotificationPrefereceException;
import com.sportganise.exceptions.notificationexceptions.UpdateNotificationPermissionException;
import com.sportganise.repositories.notifications.FcmTokenRepository;
import com.sportganise.repositories.notifications.NotificationPreferenceRepository;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/** Service class for sending notifications to devices (works with FcmService). */
@Service
@Slf4j
public class NotificationsService {
  private final FcmService fcmService;
  private final FcmTokenRepository fcmTokenRepository;
  private final NotificationPreferenceRepository notificationPreferenceRepository;

  /**
   * Constructor for Notifications Service.
   *
   * @param fcmService FcmService
   * @param fcmTokenRepository FcmTokenRepository
   * @param notificationPreferenceRepository NotificationPreferenceRepository
   */
  public NotificationsService(
      FcmService fcmService,
      FcmTokenRepository fcmTokenRepository,
      NotificationPreferenceRepository notificationPreferenceRepository) {
    this.fcmService = fcmService;
    this.fcmTokenRepository = fcmTokenRepository;
    this.notificationPreferenceRepository = notificationPreferenceRepository;
  }

  /**
   * Send a notification to a specific user.
   *
   * @param notificationRequestDto contains the notification title & message, with ids of users to
   *     notify.
   */
  public void sendNotificationToUser(NotificationRequestDto notificationRequestDto) {
    List<Integer> userIds = notificationRequestDto.getRecipients();

    // TODO - Setup DB table for user notification preferences.
    for (Integer id : userIds) {
      try {
        List<String> fcmTokens =
            fcmTokenRepository.findTokensByAccountId(notificationRequestDto.getRecipients());
        for (String token : fcmTokens) {
          NotificationFcmRequestDto request =
              NotificationFcmRequestDto.builder()
                  .title(notificationRequestDto.getTitle())
                  .body(notificationRequestDto.getBody())
                  .token(token)
                  .build();
          fcmService.sendMessageToToken(request);
        }
      } catch (DataAccessException e) {
        // Don't throw an exception here, just log. We still want to notify other devices.
        log.warn("Stale token deleted or failed to delete.");
      }
    }
  }

  /**
   * Intended to initialize notification preferences for a user on sign up (upon verification).
   *
   * @param accountId Id of the account to initialize notifications for.
   */
  public void initNotificationPreferences(int accountId) {
    try {
      notificationPreferenceRepository.save(new NotificationPreference(accountId));
      log.info("Notification preferences initialized.");
    } catch (DataAccessException e) {
      log.error("DB error when saving notification preferences.");
      throw new SaveNotificationPrefereceException(
          "DB error occured when saving notification preferences for a user.");
    }
  }

  /**
   * Enable/Disable single notification type for a user.
   *
   * @param updateNotificationPermissionDto DTO containing the account ID, notification type, and
   *                                        permission status (enabled/disabled).
   */
  public void updateNotificationPermission(
      UpdateNotificationPermissionDto updateNotificationPermissionDto) {
    try {
      NotificationPreference notificationPreference =
          notificationPreferenceRepository.findByAccountId(
              updateNotificationPermissionDto.getAccountId());
      NotificationTypeEnum notificationType = updateNotificationPermissionDto.getType();
      switch (notificationType) {
        case NotificationTypeEnum.EVENTS:
          notificationPreference.setEvents(updateNotificationPermissionDto.getEnabled());
          break;
        case NotificationTypeEnum.MESSAGING:
          notificationPreference.setMessaging(updateNotificationPermissionDto.getEnabled());
          break;
        case NotificationTypeEnum.TRAINING_SESSIONS:
          notificationPreference.setTrainingSessions(updateNotificationPermissionDto.getEnabled());
          break;
        default:
          throw new UpdateNotificationPermissionException("Invalid notification type.");
      }
    } catch (DataAccessException e) {
      log.error("DB error when updating notification permission.");
      throw new UpdateNotificationPermissionException(
          "DB error occured when updating notification permission.");
    } catch (IllegalArgumentException e) {
      log.error("Invalid notification type.");
      throw new UpdateNotificationPermissionException(
          "Invalid notification type: EVENTS, MESSAGING or TRAINING_SESSIONS required.");
    }
  }

  /**
   * Enable/Disable notification method for a user (PUSH or EMAIL).
   *
   * @param updateNotificationMethodDto DTO containing the account ID, notification method and
   *                                    permission status (enabled/disabled).
   */
  public void updateNotificationMethod(UpdateNotificationMethodDto updateNotificationMethodDto) {
    try {
      NotificationPreference notificationPreference =
          notificationPreferenceRepository.findByAccountId(
              updateNotificationMethodDto.getAccountId());
      NotificationMethodEnum notificationMethod = updateNotificationMethodDto.getMethod();
      switch (notificationMethod) {
        case NotificationMethodEnum.PUSH:
          notificationPreference.setPushNotifications(updateNotificationMethodDto.getEnabled());
          break;
        case NotificationMethodEnum.EMAIL:
          notificationPreference.setEmailNotifications(updateNotificationMethodDto.getEnabled());
          break;
      }
    } catch (DataAccessException e) {
      log.error("DB error when updating notification method.");
      throw new UpdateNotificationPermissionException(
          "DB error occured when updating notification method.");
    } catch (IllegalArgumentException e) {
      log.error("Invalid notification method.");
      throw new UpdateNotificationPermissionException(
          "Invalid notification method: PUSH or EMAIL required.");
    }
  }
}
