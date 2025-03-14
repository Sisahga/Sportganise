package com.sportganise.repositories.notifications;

import com.sportganise.entities.notifications.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository interface for NotificationPreference entity. */
public interface NotificationPreferenceRepository
    extends JpaRepository<NotificationPreference, Integer> {
  NotificationPreference findByAccountId(Integer accountId);
}
