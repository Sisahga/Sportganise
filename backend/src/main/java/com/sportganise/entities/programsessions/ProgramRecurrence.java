package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Program Recurrence table. */
@Entity
@Table(name = "program_recurrence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramRecurrence {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "recurrence_id")
  private Integer recurrenceId;

  @Column(name = "program_id")
  private Integer programId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "program_id", insertable = false, updatable = false)
  private Program program;

  @Column(name = "occurrence_date")
  private ZonedDateTime occurrenceDate;

  @Column(name = "cancelled")
  private boolean cancelled;

  /**
   * Constructor for creating a new program recurrence.
   *
   * @param programId The ID of the program this recurrence belongs to
   * @param occurrenceDate The date and time when this recurrence occurs
   * @param cancelled Whether this recurrence is cancelled
   */
  public ProgramRecurrence(Integer programId, ZonedDateTime occurrenceDate, boolean cancelled) {
    this.programId = programId;
    this.occurrenceDate = occurrenceDate;
    this.cancelled = cancelled;
  }
}
