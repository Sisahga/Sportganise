package com.sportganise.dto.programsessions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Program Details and Participants. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramAttachmentDto {
  private Integer programId;
  private String attachmentUrl;
}
