package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents the FCM token entity that will be stored in the database. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "fcm_token")
public class FcmToken {
  @NotNull
  @Column(name = "account_id", nullable = false)
  private Integer accountId;

  @Id
  @Column(nullable = false, unique = true, name = "token")
  private String token;
}
