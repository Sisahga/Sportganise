package com.sportganise.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data transfer object for notification components. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationComponentDto {
  private String notifName;
  private String description;
  private Boolean enabled;
}
