package com.sportganise.services.notifications;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sportganise.exceptions.notificationexceptions.MarkNotificationReadException;
import com.sportganise.repositories.notifications.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

@ExtendWith(MockitoExtension.class)
public class NotificationsServiceUnitTest {
  @InjectMocks private NotificationsService notificationsService;

  @Mock private NotificationRepository notificationRepository;

  @Test
  void markAlertsRead_ShouldLogAffectedRows() {
    Integer userId = 1;
    when(notificationRepository.markAllNotificationsRead(userId)).thenReturn(5);

    notificationsService.markAlertsRead(userId);

    verify(notificationRepository, times(1)).markAllNotificationsRead(userId);
  }

  @Test
  void markAlertsRead_ShouldThrowExceptionOnDataAccessError() {
    Integer userId = 1;
    when(notificationRepository.markAllNotificationsRead(userId))
        .thenThrow(new DataAccessException("DB error") {});

    assertThrows(
        MarkNotificationReadException.class, () -> notificationsService.markAlertsRead(userId));
  }
}
