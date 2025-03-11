package com.sportganise.services.firebaseFcm;

import com.sportganise.dto.fcm.NotificationFcmRequestDto;
import com.sportganise.dto.fcm.NotificationRequestDto;
import com.sportganise.exceptions.fcmexceptions.GetFcmTokenException;
import com.sportganise.repositories.FcmTokenRepository;
import java.util.List;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/** Service class for sending notifications to devices (works with FcmService). */
@Service
public class NotificationsService {
  private final FcmService fcmService;
  private final FcmTokenRepository fcmTokenRepository;

  public NotificationsService(FcmService fcmService, FcmTokenRepository fcmTokenRepository) {
    this.fcmService = fcmService;
    this.fcmTokenRepository = fcmTokenRepository;
  }

  /**
   * Send a notification to a specific user.
   *
   * @param notificationRequestDto contains the notification title & message.
   * @param userId the ID of the user to send the notification to.
   */
  public void sendNotificationToUser(
      NotificationRequestDto notificationRequestDto, Integer userId) {
    try {
      List<String> fcmTokens = fcmTokenRepository.findTokensByAccountId(userId);
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
      throw new GetFcmTokenException("Error getting FCM token from DB: " + e.getMessage());
    }
  }
}
