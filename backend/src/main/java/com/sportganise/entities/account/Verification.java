package com.sportganise.entities.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Verification entity. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Verification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "verification_id")
  private int id;

  @ManyToOne
  @JoinColumn(name = "account_id", nullable = false)
  private Account account;

  @Column(nullable = false)
  private int code;

  @Column(name = "expiry_date_time", nullable = false)
  private Timestamp expiryDateTime;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Timestamp createdAt;

  @PrePersist
  protected void onCreate() {
    if (createdAt == null) {
      createdAt = Timestamp.valueOf(LocalDateTime.now());
    }
  }

  /**
   * Non default constructor.
   *
   * @param account user account
   * @param code verification code
   * @param expiryDateTime date of code expiry
   */
  public Verification(Account account, int code, Timestamp expiryDateTime) {
    this.account = account;
    this.code = code;
    this.expiryDateTime = expiryDateTime;
  }
}
