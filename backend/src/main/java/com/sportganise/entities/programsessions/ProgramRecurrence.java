package com.sportganise.entities.programsessions;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

  public ProgramRecurrence(Integer programId, ZonedDateTime occurrenceDate, boolean cancelled) {
    this.programId = programId;
    this.occurrenceDate = occurrenceDate;
    this.cancelled = cancelled;
  }
}
