package com.sportganise.entities.notifications;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents the notification preference entity that will be stored in the database. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "notification_preference")
public class NotificationPreference {
  @Id
  @Column(name = "account_id", nullable = false)
  private Integer accountId;

  @Column(name = "push_notifications", nullable = false)
  private Boolean pushNotifications = true;
  @Column(name = "email_notifications", nullable = false)
  private Boolean emailNotifications = false;
  // Defaulting to true for all notification types.
  private Boolean events = true;
  private Boolean messaging = true;
  private Boolean trainingSessions = true;

  public NotificationPreference(int accountId) {
    this.accountId = accountId;
  }
}
