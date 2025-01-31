package com.sportganise.dto.programsessions;

import io.micrometer.common.lang.Nullable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for creating a new program. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramModifyRequestDto {
  private String title;
  private String type;
  private String startDate;
  private String endDate;
  private Boolean recurring;
  private String visibility;
  private String description;
  private Integer capacity;
  private String startTime;
  private String endTime;
  private String location;
  @Nullable private List<String> attachmentsToRemove;
}
