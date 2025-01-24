package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API object for Delete Channel Request Status. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetDeleteApproverStatusDto {
  private Integer deleteRequestId;
  private Integer channelId;
  private Integer accountId;
  private String status;
}
