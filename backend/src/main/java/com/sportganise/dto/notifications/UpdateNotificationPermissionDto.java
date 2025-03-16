package com.sportganise.dto.notifications;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for updating notification permissions. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateNotificationPermissionDto {
  private Integer accountId;

  @Enumerated(EnumType.STRING)
  private NotificationTypeEnum type; // EVENTS, TRAINING_SESSIONS, or MESSAGING.

  private Boolean enabled;
}
