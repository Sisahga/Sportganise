package com.sportganise.repositories.notifications;

import com.sportganise.entities.notifications.Notification;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/** Repository for Notification entity. */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
  @Query("SELECT n FROM Notification n WHERE n.accountId = :userId")
  List<Notification> findByAccountId(Integer userId);

  @Modifying
  @Transactional
  @Query(
      """
        DELETE FROM Notification n
        WHERE n.read = true AND n.sentAt < :retentionTime
        """)
  int deleteReadNotificationsOlderThanOneWeek(ZonedDateTime retentionTime);
}
