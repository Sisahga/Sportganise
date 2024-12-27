package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
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

  // Could be a tournament, an event of some sort or a training session
  private String programType;
  private String title;
  private String description;
  private Integer capacity;

  @Column(name = "occurence_date")
  private LocalDateTime occurenceDate;

  // Duration of the program in terms of minutes
  private Integer durationMins;

  @Column(name = "is_recurring")
  private boolean isRecurring;

  @Column(name = "expiry_date")
  private LocalDateTime expiryDate;

  private String frequency;
}
