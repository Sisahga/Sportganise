package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private ProgramType programType;

  private String title;

  private String description;

  private String author;

  private Integer capacity;

  @Column(name = "occurence_date")
  private ZonedDateTime occurrenceDate;

  @Column(name = "duration")
  private Integer durationMins;

  @Column(name = "expiry_date")
  private ZonedDateTime expiryDate;

  private String frequency;

  private String location;

  private String visibility;

  @Column(name = "cancelled")
  private boolean cancelled = false;

  /**
   * Constructor excluding programId since it's generated automatically.
   *
   * @param programType type of the program.
   * @param title title of the program.
   * @param description description of the program.
   * @param author the name of the person who created the program.
   * @param capacity capacity of the program.
   * @param occurrenceDate start date and time of the first program occurrence.
   * @param durationMins duration of the program in minutes.
   * @param expiryDate date and time of the last occurrence of the program.
   * @param frequency frequency of the program if it is recurring.
   * @param location location of the program.
   * @param visibility visibility type of the program to the members.
   */
  public Program(
      ProgramType programType,
      String title,
      String description,
      String author,
      Integer capacity,
      ZonedDateTime occurrenceDate,
      Integer durationMins,
      ZonedDateTime expiryDate,
      String frequency,
      String location,
      String visibility) {
    this.programType = programType;
    this.title = title;
    this.description = description;
    this.author = author;
    this.capacity = capacity;
    this.occurrenceDate = occurrenceDate;
    this.durationMins = durationMins;
    this.expiryDate = expiryDate;
    this.frequency = frequency;
    this.location = location;
    this.visibility = visibility;
  }
}
