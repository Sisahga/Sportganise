package com.sportganise.schedulers;

import com.sportganise.services.notifications.NotificationsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationCleanupTask {
  private final NotificationsService notificationsService;

  public NotificationCleanupTask(NotificationsService notificationsService) {
    this.notificationsService = notificationsService;
  }

  /**
   * Cleans up read notifications every day at midnight. Read notifications that are 1 week or older
   * are deleted.
   */
  @Scheduled(cron = "0 0 0 * * ?")
  public void cleanup() {
    log.info("Cleaning up read notifications...");
    try {
      int deletedCount = notificationsService.cleanupOldReadNotifications();
      log.info("Deleted {} read notifications.", deletedCount);
      log.info("Notification clean up task successful.");
    } catch (DataAccessException e) {
      log.error(e.getMessage());
    }
  }
}
