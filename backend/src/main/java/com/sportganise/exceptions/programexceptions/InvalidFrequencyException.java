package com.sportganise.exceptions.programexceptions;

/** Exception thrown when an invalid frequency is provided. */
public class InvalidFrequencyException extends RuntimeException {
    public InvalidFrequencyException(String message) {
        super(message);
    }
}
