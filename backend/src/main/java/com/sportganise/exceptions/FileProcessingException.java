package com.sportganise.exceptions;

/** FileProcessingException is thrown when an error occurs while processing a file. */
public class FileProcessingException extends RuntimeException {
  public FileProcessingException(String message) {
    super(message);
  }
}
