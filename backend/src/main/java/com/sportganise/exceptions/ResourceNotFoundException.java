package com.sportganise.exceptions;

/** Exception thrown when a resource is not found. */
public class ResourceNotFoundException extends Exception {
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
