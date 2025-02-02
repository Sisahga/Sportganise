package com.sportganise.dto.trainingplans;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for Training Plan Response. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainingPlanResponseDto {
  private List<TrainingPlanDto> myPlans;
  private List<TrainingPlanDto> sharedWithMe;
}
