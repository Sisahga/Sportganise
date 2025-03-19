package com.sportganise.repositories.notifications;

import com.sportganise.entities.notifications.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Repository interface for NotificationPreference entity. */
public interface NotificationPreferenceRepository
    extends JpaRepository<NotificationPreference, Integer> {
  @Query("SELECT n FROM NotificationPreference n WHERE n.accountId = :accountId")
  NotificationPreference findByAccountId(Integer accountId);
}
