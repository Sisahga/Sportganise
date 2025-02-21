package com.sportganise.services.firebaseFcm;

import com.google.firebase.messaging.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sportganise.dto.firebaseFcm.NotificationRequest;
import com.sportganise.exceptions.NotificationNotSentException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ExecutionException;

/**
 * Service class for sending messages to devices via Firebase FCM.
 */
@Slf4j
@Service
public class FcmService {
  /**
   * Send a notification to specific device(s).
   *
   * @param request contains the notification title & message, optional topic, & the target device token.
   * @throws InterruptedException if the request is interrupted.
   * @throws ExecutionException if the request fails.
   */
  public void sendMessageToToken(NotificationRequest request) {
    Message message = getPreconfiguredMessageToToken(request);
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    String jsonOutput = gson.toJson(message);
    try {
      String response = sendAndGetResponse(message);
      log.info("Sent message to token. Device token: {}, {}, {}", request.getToken(), response, jsonOutput);
    } catch (InterruptedException | ExecutionException e) {
      log.error("Error sending notification message to token. Device token: {}, {}", request.getToken(), jsonOutput);
      throw new NotificationNotSentException("Error sending notification message to token: " + request.getToken());
    }
  }

  private String sendAndGetResponse(Message message) throws InterruptedException, ExecutionException {
    return FirebaseMessaging.getInstance().sendAsync(message).get();
  }

  private AndroidConfig getAndroidConfig(String topic) {
    return AndroidConfig.builder()
            .setTtl(Duration.ofMinutes(2).toMillis()).setCollapseKey(topic)
            .setPriority(AndroidConfig.Priority.HIGH)
            .setNotification(AndroidNotification.builder()
                    .setTag(topic).build()).build();
  }

  private ApnsConfig getApnsConfig(String topic) {
    return ApnsConfig.builder()
            .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build()).build();
  }

  private Message getPreconfiguredMessageToToken(NotificationRequest request) {
    return getPreconfiguredMessageBuilder(request).setToken(request.getToken())
            .build();
  }

  private Message.Builder getPreconfiguredMessageBuilder(NotificationRequest request) {
    AndroidConfig androidConfig = getAndroidConfig(request.getTopic());
    ApnsConfig apnsConfig = getApnsConfig(request.getTopic());
    Notification notification = Notification.builder()
            .setTitle(request.getTitle())
            .setBody(request.getBody())
            .build();
    return Message.builder()
            .setApnsConfig(apnsConfig).setAndroidConfig(androidConfig).setNotification(notification);
  }
}
