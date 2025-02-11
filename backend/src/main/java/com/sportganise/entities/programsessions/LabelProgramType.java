package com.sportganise.entities.programsessions;

import com.fasterxml.jackson.annotation.JsonValue;

/** ENUM for the types of programs. */
public enum LabelProgramType {
  PRIVATE("Private"),
  PUBLIC("Tournament");

  private final String value;

  LabelProgramType(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }
}
