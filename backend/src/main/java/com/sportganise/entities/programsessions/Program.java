package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.ZonedDateTime;
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
  private ZonedDateTime occurrenceDate;

  // Duration of the program in terms of minutes
  @Column(name = "duration")
  private Integer durationMins;

  @Column(name = "is_recurring")
  private boolean isRecurring;

  @Column(name = "expiry_date")
  private ZonedDateTime expiryDate;

  private String frequency;

  private String location;

  private String visibility;

  /**
   * Constructor excluding programId since it's generated automatically.
   *
   * @param programType type of the program.
   * @param title title of the program.
   * @param description description of the program.
   * @param capacity capacity of the program.
   * @param occurrenceDate start date and time of the first program occurrence.
   * @param durationMins duration of the program in minutes.
   * @param isRecurring boolean for whether or not this program is a recurring one.
   * @param expiryDate date and time of the last occurrence of the program.
   * @param frequency frequency of the program if it is recurring.
   * @param location location of the program.
   * @param visibility visibility type of the program to the members.
   */
  public Program(
      String programType,
      String title,
      String description,
      Integer capacity,
      ZonedDateTime occurrenceDate,
      Integer durationMins,
      Boolean isRecurring,
      ZonedDateTime expiryDate,
      String frequency,
      String location,
      String visibility) {
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
  }
}
