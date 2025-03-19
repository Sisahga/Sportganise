package com.sportganise.services.notifications;

import com.sportganise.dto.notifications.NotificationAlertsDto;
import com.sportganise.dto.notifications.NotificationComponentDto;
import com.sportganise.dto.notifications.NotificationDto;
import com.sportganise.dto.notifications.NotificationFcmRequestDto;
import com.sportganise.dto.notifications.NotificationMethodDto;
import com.sportganise.dto.notifications.NotificationMethodEnum;
import com.sportganise.dto.notifications.NotificationRequestDto;
import com.sportganise.dto.notifications.NotificationSettingsDto;
import com.sportganise.dto.notifications.NotificationTypeEnum;
import com.sportganise.dto.notifications.UpdateNotificationMethodDto;
import com.sportganise.dto.notifications.UpdateNotificationPermissionDto;
import com.sportganise.entities.notifications.NotificationPreference;
import com.sportganise.exceptions.notificationexceptions.GetNotificationPermissionException;
import com.sportganise.exceptions.notificationexceptions.MarkNotificationReadException;
import com.sportganise.exceptions.notificationexceptions.SaveNotificationPrefereceException;
import com.sportganise.exceptions.notificationexceptions.UpdateNotificationPermissionException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.notifications.FcmTokenRepository;
import com.sportganise.repositories.notifications.NotificationPreferenceRepository;
import com.sportganise.repositories.notifications.NotificationRepository;
import com.sportganise.services.EmailService;
import java.time.ZonedDateTime;
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
  private final AccountRepository accountRepository;
  private final EmailService emailService;
  private final NotificationRepository notificationRepository;

  /**
   * Constructor for Notifications Service.
   *
   * @param fcmService FcmService
   * @param fcmTokenRepository FcmTokenRepository
   * @param notificationPreferenceRepository NotificationPreferenceRepository
   * @param accountRepository AccountRepository
   * @param emailService EmailService
   */
  public NotificationsService(
      FcmService fcmService,
      FcmTokenRepository fcmTokenRepository,
      NotificationPreferenceRepository notificationPreferenceRepository,
      AccountRepository accountRepository,
      EmailService emailService,
      NotificationRepository notificationRepository) {
    this.fcmService = fcmService;
    this.fcmTokenRepository = fcmTokenRepository;
    this.notificationPreferenceRepository = notificationPreferenceRepository;
    this.accountRepository = accountRepository;
    this.emailService = emailService;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Send a notification to a specific user.
   *
   * @param notificationRequestDto contains the notification title & message, with ids of users to
   *     notify.
   */
  public void sendNotificationToUser(NotificationRequestDto notificationRequestDto) {
    List<Integer> userIds = notificationRequestDto.getRecipients();

    NotificationPreference np;
    for (Integer id : userIds) {
      np = notificationPreferenceRepository.findByAccountId(id);
      log.debug("Found notification preference for user with id {}", id);
      log.debug("Push enabled: {}", np.getPushNotifications());
      log.debug("Email enabled: {}", np.getEmailNotifications());
      // Send push notification if enabled.
      if (np.getPushNotifications()) {
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
      // Send email notification if enabled.
      if (np.getEmailNotifications()) {
        String email = accountRepository.getEmailByAccountId(id);
        String subject = "New Notification - " + notificationRequestDto.getTitle();
        emailService.sendEmail(email, subject, notificationRequestDto.getBody());
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
   *     permission status (enabled/disabled).
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
          notificationPreferenceRepository.save(notificationPreference);
          break;
        case NotificationTypeEnum.MESSAGING:
          notificationPreference.setMessaging(updateNotificationPermissionDto.getEnabled());
          notificationPreferenceRepository.save(notificationPreference);
          break;
        case NotificationTypeEnum.TRAINING_SESSIONS:
          notificationPreference.setTrainingSessions(updateNotificationPermissionDto.getEnabled());
          notificationPreferenceRepository.save(notificationPreference);
          break;
        default:
          throw new UpdateNotificationPermissionException("Invalid notification type.");
      }
    } catch (DataAccessException e) {
      log.error("DB error when updating notification permission.");
      throw new UpdateNotificationPermissionException(
          "DB error occured when updating notification permission.");
    }
  }

  /**
   * Enable/Disable notification method for a user (PUSH or EMAIL).
   *
   * @param updateNotificationMethodDto DTO containing the account ID, notification method and
   *     permission status (enabled/disabled).
   */
  public void updateNotificationMethod(UpdateNotificationMethodDto updateNotificationMethodDto) {
    try {
      NotificationPreference notificationPreference =
          notificationPreferenceRepository.findByAccountId(
              updateNotificationMethodDto.getAccountId());
      log.debug("METHOD: {}", updateNotificationMethodDto.getMethod());
      NotificationMethodEnum notificationMethod = updateNotificationMethodDto.getMethod();
      switch (notificationMethod) {
        case NotificationMethodEnum.PUSH:
          notificationPreference.setPushNotifications(updateNotificationMethodDto.getEnabled());
          notificationPreferenceRepository.save(notificationPreference);
          break;
        case NotificationMethodEnum.EMAIL:
          notificationPreference.setEmailNotifications(updateNotificationMethodDto.getEnabled());
          notificationPreferenceRepository.save(notificationPreference);
          break;
        default:
          throw new UpdateNotificationPermissionException("Invalid notification method.");
      }
    } catch (DataAccessException e) {
      log.error("DB error when updating notification method.");
      throw new UpdateNotificationPermissionException(
          "DB error occured when updating notification method.");
    }
  }

  /**
   * Get notification settings for a user.
   *
   * @param userId Id of the user to get notification settings for.
   * @return NotificationSettingsDto containing the notification settings.
   */
  public NotificationSettingsDto getNotificationSettings(Integer userId) {
    try {
      NotificationPreference np = notificationPreferenceRepository.findByAccountId(userId);
      return NotificationSettingsDto.builder()
          .notificationMethods(
              List.of(
                  NotificationMethodDto.builder()
                      .notificationMethod(NotificationMethodEnum.PUSH)
                      .enabled(np.getPushNotifications())
                      .build(),
                  NotificationMethodDto.builder()
                      .notificationMethod(NotificationMethodEnum.EMAIL)
                      .enabled(np.getEmailNotifications())
                      .build()))
          .notificationComponents(
              List.of(
                  NotificationComponentDto.builder()
                      .notifName(NotificationTypeEnum.TRAINING_SESSIONS)
                      .description("Get notified about upcoming training sessions and changes.")
                      .enabled(np.getTrainingSessions())
                      .build(),
                  NotificationComponentDto.builder()
                      .notifName(NotificationTypeEnum.EVENTS)
                      .description("Receive updates about tournaments and special events.")
                      .enabled(np.getEvents())
                      .build(),
                  NotificationComponentDto.builder()
                      .notifName(NotificationTypeEnum.MESSAGING)
                      .description("Get notified when someone messages you.")
                      .enabled(np.getMessaging())
                      .build()))
          .build();
    } catch (DataAccessException e) {
      log.error("DB error when getting notification settings.");
      throw new GetNotificationPermissionException(
          "DB error occured when getting notification settings.");
    }
  }

  /**
   * Get notification alerts for a user.
   *
   * @param userId Id of the user to get notification alerts for.
   * @return NotificationAlertsDto containing the notifications.
   */
  public NotificationAlertsDto getNotificationAlerts(Integer userId) {
    List<NotificationDto> notifications = notificationRepository.findByAccountId(userId);
    return NotificationAlertsDto.builder().notifications(notifications).build();
  }

  /**
   * Clean up read notifications. Read notifications that are 1 week or older. Works with
   * NotificationCleanupTask.
   *
   * @return int Number of deleted notifications.
   */
  public int cleanupOldReadNotifications() {
    ZonedDateTime retentionTime = ZonedDateTime.now().minusWeeks(1);
    int deletedCount =
        notificationRepository.deleteReadNotificationsOlderThanOneWeek(retentionTime);
    log.info("Cleaned up {} notifications.", deletedCount);
    return deletedCount;
  }

  /**
   * Mark all alerts as read for a user.
   *
   * @param userId Id of the user to mark alerts as read for.
   */
  public void markAlertsRead(Integer userId) {
    try {
      int affectedRows = notificationRepository.markAllNotificationsRead(userId);
      log.debug("Marked {} notifications read for user {}.", affectedRows, userId);
    } catch (DataAccessException e) {
      log.error("DB error when marking alerts as read.");
      throw new MarkNotificationReadException("DB error occured when marking alerts as read.");
    }
  }
}
