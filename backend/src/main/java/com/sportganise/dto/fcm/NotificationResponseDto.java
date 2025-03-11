package com.sportganise.dto.fcm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the notification response that will be received from the Firebase Cloud
 * Messaging server after sending a notification to devices.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponseDto {
  private int status;
  private String message;
}
