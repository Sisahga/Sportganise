package com.sportganise.dto.notifications;

import com.sportganise.entities.notifications.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Data transfer object for notification alerts.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationAlertsDto {
  List<Notification> notifications;
}
