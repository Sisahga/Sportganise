package com.sportganise.dto.fcm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationFcmRequestDto {
  private String title;
  private String body;
  private String topic; // Optional topic to send the notification to a group of people.
  private String token; // The firebase token of the device to send the notification to.
}
