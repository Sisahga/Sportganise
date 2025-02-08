package com.sportganise.entities.programsessions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** ENUM for the types of programs. */
public enum ProgramType {
  FUNDRAISER("Fundraiser"),
  TOURNAMENT("Tournament"),
  TRAINING("Training"),
  SPECIALTRAINING("Special Training");

  private final String value;

  ProgramType(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  /**
   * This method is used to map a string value (e.g., from JSON input) to the corresponding {@link
   * ProgramType} enum constant. It performs a case-insensitive comparison to match the string value
   * with one of the predefined enum values.
   *
   * @param value The string value to be converted into an enum constant.
   * @return The corresponding {@link ProgramType} enum constant.
   * @throws IllegalArgumentException If the provided value does not match any enum constant.
   */
  @JsonCreator
  public static ProgramType fromValue(String value) {
    for (ProgramType type : values()) {
      if (type.value.equalsIgnoreCase(value)) {
        return type;
      }
    }
    throw new IllegalArgumentException("Unknown program type: " + value);
  }
}
