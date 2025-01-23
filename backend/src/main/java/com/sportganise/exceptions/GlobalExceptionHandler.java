package com.sportganise.exceptions;

import com.sportganise.dto.ResponseDto;
import com.sportganise.exceptions.ChannelExceptions.ChannelCreationException;
import com.sportganise.exceptions.ChannelExceptions.ChannelDeletionException;
import com.sportganise.exceptions.ChannelExceptions.ChannelFetchException;
import com.sportganise.exceptions.ChannelMemberExceptions.ChannelMemberDeleteException;
import com.sportganise.exceptions.ChannelMemberExceptions.ChannelMemberFetchException;
import com.sportganise.exceptions.ChannelMemberExceptions.ChannelMemberMarkReadException;
import com.sportganise.exceptions.ChannelMemberExceptions.ChannelMemberSaveException;
import com.sportganise.exceptions.DirectMessageExceptions.DirectMessageFetchException;
import com.sportganise.exceptions.DirectMessageExceptions.DirectMessageSendException;
import com.sportganise.exceptions.ProgramExceptions.ProgramCreationException;
import com.sportganise.exceptions.ProgramExceptions.ProgramModificationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Global exception handler. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ResponseDto<?> handleForbiddenException(ForbiddenException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.FORBIDDEN.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseDto<?> handleResourceNotFoundException(ResourceNotFoundException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.NOT_FOUND.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelCreationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleChannelCreationException(ChannelCreationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelDeletionException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelDeletionException(ChannelDeletionException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelFetchException(ChannelFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelMemberSaveException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberSaveException(ChannelMemberSaveException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelMemberFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberFetchException(ChannelMemberFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelMemberDeleteException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberDeletionException(ChannelMemberDeleteException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(DirectMessageSendException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleDirectMessageSendException(DirectMessageSendException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ChannelMemberMarkReadException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMarkReadException(ChannelMemberMarkReadException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(DirectMessageFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleDirectMessageFetchException(DirectMessageFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ProgramCreationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleProgramCreationException(ProgramCreationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(ProgramModificationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleProgramModificationException(ProgramModificationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message("Program modification failed: " + e.getMessage())
        .build();
  }

  @ExceptionHandler(FileProcessingException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleFileProcessingException(FileProcessingException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleGenericException(Exception e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }
}
