package com.sportganise.exceptions;

/**
 * Exception thrown when a resource is not found.
 *
 * <p>This is the general class when any resource cannot be found in the data store. Could be
 * extended for specific types of resource.
 */
public class ResourceNotFoundException extends Exception {
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
