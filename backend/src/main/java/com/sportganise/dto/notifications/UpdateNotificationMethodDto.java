package com.sportganise.dto.notifications;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for updating notification methods. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateNotificationMethodDto {
  private Integer accountId;

  @Enumerated(EnumType.STRING)
  private NotificationMethodEnum method; // PUSH or EMAIL.

  private Boolean enabled;
}
