package com.sportganise.dto.trainingplans;

import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for Training Plans. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainingPlanDto {
    @NotNull
    private Integer planId;
    @NotNull
    private Integer userId;
    @NotNull
    private String docUrl;
    @NotNull
    private ZonedDateTime creationDate;
}
