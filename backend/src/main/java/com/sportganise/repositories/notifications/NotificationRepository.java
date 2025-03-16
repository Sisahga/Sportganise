package com.sportganise.repositories.notifications;

import com.sportganise.entities.notifications.Notification;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
  @Modifying
  @Transactional
  @Query(
      """
        DELETE FROM Notification n
        WHERE n.read = true AND n.sentAt < :retentionTime
        """)
  int deleteReadNotificationsOlderThanOneWeek(ZonedDateTime retentionTime);
}
