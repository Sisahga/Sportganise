package com.sportganise.dto.notifications;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data transfer object for notification settings. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationSettingsDto {
  private List<NotificationComponentDto> notificationComponents;
}
