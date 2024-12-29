package com.sportganise.dto.programsessions;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

import com.sportganise.entities.programsessions.Program;

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
    private LocalDateTime occurenceDate;
    private Integer durationMins; // Duration of the program in terms of minutes
    private boolean isRecurring;
    private LocalDateTime expiryDate;
    private String frequency;
    private String location;
    private String visibility;
    private String attachment;

    // Constructor that converts a Program entity to ProgramDto
    public ProgramDto(Program program) {
        this.programId = program.getProgramId();
        this.programType = program.getProgramType();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.capacity = program.getCapacity();
        this.occurenceDate = program.getOccurrenceDate();
        this.durationMins = program.getDurationMins();
        this.isRecurring = program.isRecurring();
        this.expiryDate = program.getExpiryDate();
        this.frequency = program.getFrequency();
        this.location = program.getLocation();
        this.visibility = program.getVisibility();
        this.attachment = null; // The "Program" entity doesn't handle file attachments directly, it will be in
                                // the handleFileUpload() method
    }
}
