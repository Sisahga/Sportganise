package com.sportganise.dto.firebaseFcm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the notification request that will be sent to the Firebase Cloud Messaging
 * server to send a notification to devices.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationRequest {
  private String title;
  private String body;
  private String topic; // Optional topic to send the notification to a group of people.
  private String token; // The firebase token of the device to send the notification to.
}
