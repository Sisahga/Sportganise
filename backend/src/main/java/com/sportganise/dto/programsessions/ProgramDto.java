package com.sportganise.dto.programsessions;

import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramType;
import java.time.ZonedDateTime;
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
public class ProgramDto {
  private Integer programId;
  private ProgramType programType;
  private String title;
  private String description;
  private String author;
  private Integer capacity;
  private ZonedDateTime occurrenceDate;
  private Integer durationMins;
  private boolean isRecurring;
  private ZonedDateTime expiryDate;
  private String frequency;
  private String location;
  private String visibility;
  private List<ProgramAttachmentDto> programAttachments;

  /**
   * Constructor that converts a Program entity to ProgramDto.
   *
   * @param program program object that is used for the conversion.
   * @param programAttachments program attachments object uploaded for a specific program.
   */
  public ProgramDto(Program program, List<ProgramAttachmentDto> programAttachments) {
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
    this.programAttachments = programAttachments;
  }
}
