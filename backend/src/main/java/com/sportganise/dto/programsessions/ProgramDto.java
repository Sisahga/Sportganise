package com.sportganise.dto.programsessions;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

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
}


