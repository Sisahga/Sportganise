package com.sportganise.services.notifications;

import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sportganise.dto.notifications.NotificationFcmRequestDto;
import com.sportganise.dto.notifications.StoreFcmTokenDto;
import com.sportganise.entities.notifications.FcmToken;
import com.sportganise.exceptions.notificationexceptions.StoreFcmTokenException;
import com.sportganise.repositories.notifications.FcmTokenRepository;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.util.concurrent.ExecutionException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service class for managing Firebase FCM notitifications. */
@Slf4j
@Service
public class FcmService {
  private final FcmTokenRepository fcmTokenRepository;

  public FcmService(FcmTokenRepository fcmTokenRepository) {
    this.fcmTokenRepository = fcmTokenRepository;
  }

  /**
   * Send a notification to specific device(s). If the device token doesn't exist in Firebase, it
   * will be deleted from the DB and not raise any error.
   *
   * @param request contains the notification title & message, optional topic, & the target device
   *     token.
   */
  @Transactional
  public void sendMessageToToken(NotificationFcmRequestDto request) {
    Message message = getPreconfiguredMessageToToken(request);
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    String jsonOutput = gson.toJson(message);
    try {
      String response = sendAndGetResponse(message);
      log.info(
          "Sent message to token. Device token: {}, {}, {}",
          request.getToken(),
          response,
          jsonOutput);
    } catch (InterruptedException | ExecutionException e) {
      log.debug("Deleting stale token from DB: {}", request.getToken());
      deleteFcmToken(request.getToken());
      log.debug("Deleted stale fcm token.");
    }
  }

  /**
   * Store the FCM token of a device in DB.
   *
   * @param fcmTokenDto contains the account ID & the FCM token.
   */
  public void storeFcmToken(StoreFcmTokenDto fcmTokenDto) {
    try {
      FcmToken fcmToken =
          FcmToken.builder()
              .accountId(fcmTokenDto.getAccountId())
              .token(fcmTokenDto.getToken())
              .build();
      this.fcmTokenRepository.save(fcmToken);
    } catch (Exception e) {
      throw new StoreFcmTokenException(
          "Unexpected error storing FCM token in DB: " + fcmTokenDto.getToken());
    }
  }

  /**
   * Delete a FCM token from DB.
   *
   * @param fcmToken the FCM token to delete.
   */
  public void deleteFcmToken(String fcmToken) {
    try {
      this.fcmTokenRepository.deleteFcmToken(fcmToken);
    } catch (Exception e) {
      log.error("Error deleting FCM token from DB: {}", fcmToken);
    }
  }

  private String sendAndGetResponse(Message message)
      throws InterruptedException, ExecutionException {
    return FirebaseMessaging.getInstance().sendAsync(message).get();
  }

  private AndroidConfig getAndroidConfig(String topic) {
    return AndroidConfig.builder()
        .setTtl(Duration.ofMinutes(2).toMillis())
        .setCollapseKey(topic)
        .setPriority(AndroidConfig.Priority.HIGH)
        .setNotification(AndroidNotification.builder().setTag(topic).build())
        .build();
  }

  private ApnsConfig getApnsConfig(String topic) {
    return ApnsConfig.builder()
        .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build())
        .build();
  }

  private Message getPreconfiguredMessageToToken(NotificationFcmRequestDto request) {
    return getPreconfiguredMessageBuilder(request).setToken(request.getToken()).build();
  }

  private Message.Builder getPreconfiguredMessageBuilder(NotificationFcmRequestDto request) {
    AndroidConfig androidConfig = getAndroidConfig(request.getTopic());
    ApnsConfig apnsConfig = getApnsConfig(request.getTopic());
    Notification notification =
        Notification.builder().setTitle(request.getTitle()).setBody(request.getBody()).build();
    return Message.builder()
        .setApnsConfig(apnsConfig)
        .setAndroidConfig(androidConfig)
        .setNotification(notification);
  }
}
