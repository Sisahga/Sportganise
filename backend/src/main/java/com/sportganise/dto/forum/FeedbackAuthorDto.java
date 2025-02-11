package com.sportganise.dto.forum;

import com.sportganise.entities.account.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for FeedbackAuthor. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackAuthorDto {
  private Integer accountId;
  private String name;
  private AccountType type;
  private String pictureUrl;
}
