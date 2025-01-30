package com.sportganise.dto.account.auth;

import lombok.Getter;

/** Data transfer object for verification. */
@Getter
public class VerificationDto {
  private int code;
  private String email;
}
