package com.sportganise.services.notifications;

import com.sportganise.repositories.notifications.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class NotificationCleanupServiceUnitTest {
  @Mock
  private NotificationRepository notificationRepository;

  @InjectMocks
  private NotificationsService notificationsService;

  @Test
  void testCleanupOldReadNotifications() {
    when(notificationRepository.deleteReadNotificationsOlderThanOneWeek(any(ZonedDateTime.class)))
            .thenReturn(5);

    int result = notificationsService.cleanupOldReadNotifications();

    assertEquals(5, result);
    verify(notificationRepository).deleteReadNotificationsOlderThanOneWeek(any(ZonedDateTime.class));
  }
}
