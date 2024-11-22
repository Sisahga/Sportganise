package com.sportganise.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for TrainingSession table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Integer programId;
  
    private String type;
    private String title;
    private String description;
    private Integer capacity;

    @Column(name = "occurence_date")
    private LocalDateTime occurenceDate;
    private Integer duration;

    @Column(name = "is_recurring")
    private boolean isRecurring;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    private String frequency;
}
