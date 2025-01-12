package com.sportganise.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;




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

    @Column(name = "expiry_date", nullable = false)
    private Timestamp expiryDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Timestamp.valueOf(LocalDateTime.now());
        }
    }

    /**
     * Non default constructor
     * @param account user account
     * @param code verification code
     * @param expiryDate date of code expiry
     */
    public Verification(Account account, int code, Timestamp expiryDate) {
        this.account = account;
        this.code = code;
        this.expiryDate = expiryDate;
    }
}

