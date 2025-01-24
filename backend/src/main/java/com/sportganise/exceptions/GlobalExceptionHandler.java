package com.sportganise.exceptions;

import com.sportganise.dto.ResponseDto;
import com.sportganise.exceptions.channelexceptions.ChannelCreationException;
import com.sportganise.exceptions.channelexceptions.ChannelDeletionException;
import com.sportganise.exceptions.channelexceptions.ChannelFetchException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberDeleteException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberFetchException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberMarkReadException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSaveException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSetRoleException;
import com.sportganise.exceptions.deletechannelrequestexceptions.DeleteChannelApproverException;
import com.sportganise.exceptions.directmessageexceptions.DirectMessageFetchException;
import com.sportganise.exceptions.directmessageexceptions.DirectMessageSendException;
import com.sportganise.exceptions.programexceptions.ProgramCreationException;
import com.sportganise.exceptions.programexceptions.ProgramModificationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Global exception handler. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Handle general forbidden exceptions.
   *
   * @param e exception
   * @return response dto with status 403.
   */
  @ExceptionHandler(ForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ResponseDto<?> handleForbiddenException(ForbiddenException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.FORBIDDEN.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle general resource not found exceptions.
   *
   * @param e exception
   * @return response dto with status 404.
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseDto<?> handleResourceNotFoundException(ResourceNotFoundException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.NOT_FOUND.value())
        .message(e.getMessage())
        .build();
  }

  // <editor-fold desc="Region: Channel Exceptions">
  /**
   * Handle bad request exception for channel creation.
   *
   * @param e exception
   * @return response dto with status 400.
   */
  @ExceptionHandler(ChannelCreationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleChannelCreationException(ChannelCreationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel deletion exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelDeletionException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelDeletionException(ChannelDeletionException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel fetch exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelFetchException(ChannelFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  // </editor-fold>

  //<editor-fold desc="Region: Delete Channel Request Exceptions">

  /**
   * Handle delete channel approver exception.
   * @param e exception
   * @return response dto with status 404.
   */
  @ExceptionHandler(DeleteChannelApproverException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseDto<?> handleDeleteChannelApproverException(DeleteChannelApproverException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.NOT_FOUND.value())
        .message(e.getMessage())
        .build();
  }
  //</editor-fold>

  // <editor-fold desc="Region: Channel Member Exceptions">
  /**
   * Handle internal server error on channel member save exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelMemberSaveException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberSaveException(ChannelMemberSaveException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel member fetch exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelMemberFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberFetchException(ChannelMemberFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel member deletion exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelMemberDeleteException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberDeletionException(ChannelMemberDeleteException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel member mark read exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelMemberMarkReadException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMarkReadException(ChannelMemberMarkReadException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on channel member set role exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(ChannelMemberSetRoleException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleChannelMemberSetRoleException(ChannelMemberSetRoleException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  // </editor-fold>

  // <editor-fold desc="Region: Direct Message Exceptions">
  /**
   * Handle internal server error on direct message send exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(DirectMessageSendException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleDirectMessageSendException(DirectMessageSendException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle internal server error on direct message fetch exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(DirectMessageFetchException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleDirectMessageFetchException(DirectMessageFetchException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  // </editor-fold>

  // <editor-fold desc="Region: Program Exceptions">
  /**
   * Handle program creation exception.
   *
   * @param e exception
   * @return response dto with status 400.
   */
  @ExceptionHandler(ProgramCreationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleProgramCreationException(ProgramCreationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle program modification exception.
   *
   * @param e exception
   * @return response dto with status 400.
   */
  @ExceptionHandler(ProgramModificationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseDto<?> handleProgramModificationException(ProgramModificationException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .message("Program modification failed: " + e.getMessage())
        .build();
  }

  // </editor-fold>

  /**
   * Handle file processing exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(FileProcessingException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleFileProcessingException(FileProcessingException e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }

  /**
   * Handle generic exception.
   *
   * @param e exception
   * @return response dto with status 500.
   */
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseDto<?> handleGenericException(Exception e) {
    return ResponseDto.builder()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(e.getMessage())
        .build();
  }
}
