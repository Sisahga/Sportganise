package com.sportganise.dto.programsessions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Program Cancellation. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CancelProgramDto {
  boolean cancel;
}
