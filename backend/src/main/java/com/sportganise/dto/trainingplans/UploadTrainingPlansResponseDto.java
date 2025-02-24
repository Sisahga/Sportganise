package com.sportganise.dto.trainingplans;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Response DTO for uploading training plans. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadTrainingPlansResponseDto {
  List<String> trainingPlanBlobs;
}
