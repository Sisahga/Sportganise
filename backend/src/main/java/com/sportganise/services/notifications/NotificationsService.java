package com.sportganise.services.notifications;

import com.sportganise.dto.fcm.NotificationFcmRequestDto;
import com.sportganise.dto.fcm.NotificationRequestDto;
import com.sportganise.entities.notifications.NotificationPreference;
import com.sportganise.exceptions.notificationexceptions.SaveNotificationPrefereceException;
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
}
