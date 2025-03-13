package com.sportganise.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the notification request that will be sent to the Firebase Cloud Messaging.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreFcmTokenDto {
  private Integer accountId;
  private String token;
}
