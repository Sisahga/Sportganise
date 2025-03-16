package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Program Recurrence table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "program_recurrence")
public class ProgramRecurrence {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "recurrence_id")
  private Integer recurrenceId;

  @Column(name = "program_id")
  private Integer programId;

  @Column(name = "occurrence_date")
  private ZonedDateTime occurrenceDate;

  @Column(name = "cancelled")
  private boolean cancelled;

  /**
   * Constructor for Program Recurrence.
   *
   * @param programId the program id.
   * @param occurrenceDate the occurrence date.
   * @param cancelled the cancelled status.
   */
  public ProgramRecurrence(Integer programId, ZonedDateTime occurrenceDate, boolean cancelled) {
    this.programId = programId;
    this.occurrenceDate = occurrenceDate;
    this.cancelled = cancelled;
  }
}
