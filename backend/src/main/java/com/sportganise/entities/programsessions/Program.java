package com.sportganise.entities.programsessions;

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

/** Entity Model for Program table. */
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
  @Column(name = "type")
  private String programType;

  private String title;
  private String description;
  private Integer capacity;

  @Column(name = "occurence_date")
  private LocalDateTime occurrenceDate;

  // Duration of the program in terms of minutes
  private Integer durationMins;

  @Column(name = "is_recurring")
  private boolean isRecurring;

  @Column(name = "expiry_date")
  private LocalDateTime expiryDate;

  private String frequency;

  private String location;

  private String visibility;

  private String attachment;

  // Constructor excluding programId since it's generated automatically
  public Program(String programType, String title, String description, Integer capacity,
                 LocalDateTime occurrenceDate, Integer durationMins, Boolean isRecurring, 
                 LocalDateTime expiryDate, String frequency, String location, String visibility, String attachment) {
    this.programType = programType;
    this.title = title;
    this.description = description;
    this.capacity = capacity;
    this.occurrenceDate = occurrenceDate;
    this.durationMins = durationMins;
    this.isRecurring = isRecurring;
    this.expiryDate = expiryDate;
    this.frequency = frequency;
    this.location = location;
    this.visibility = visibility;
    this.attachment = attachment;
  }
}
