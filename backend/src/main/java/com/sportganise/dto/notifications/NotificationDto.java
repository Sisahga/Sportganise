package com.sportganise.dto.notifications;

import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data transfer object for notifications. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDto {
  private Integer notificationId;
  private String title;
  private String body;
  private Boolean read;
  private ZonedDateTime sentAt;
}
