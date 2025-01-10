package com.sportganise.dto.programsessions;

import com.sportganise.entities.programsessions.Program;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Programs. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProgramDto {
  private Integer programId;
  private String programType; // Could be an event of some sort, tournament or training sessions
  private String title;
  private String description;
  private Integer capacity;
  private LocalDateTime occurrenceDate;
  private Integer durationMins; // Duration of the program in terms of minutes
  private boolean isRecurring;
  private LocalDateTime expiryDate;
  private String frequency;
  private String location;
  private String visibility;
  private List<String> attachment;

  /**
   * Constructor that converts a Program entity to ProgramDto.
   *
   * @param program program object that is used for the conversion.
   */
  public ProgramDto(Program program) {
    this.programId = program.getProgramId();
    this.programType = program.getProgramType();
    this.title = program.getTitle();
    this.description = program.getDescription();
    this.capacity = program.getCapacity();
    this.occurrenceDate = program.getOccurrenceDate();
    this.durationMins = program.getDurationMins();
    this.isRecurring = program.isRecurring();
    this.expiryDate = program.getExpiryDate();
    this.frequency = program.getFrequency();
    this.location = program.getLocation();
    this.visibility = program.getVisibility();
    this.attachment = program.getAttachment();
  }
}
