package com.sportganise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/** ResponseDTO. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDto<T> {
  private int statusCode;
  private String message;
  private T data;

  /** Constructs a ResponseEntity with HTTP status OK (200). */
  public static <U> ResponseEntity<ResponseDto<U>> ok(U data, String message) {
    return newResponse(HttpStatus.OK, data, message);
  }

  /** Constructs a ResponseEntity with HTTP status CREATED (201). */
  public static <U> ResponseEntity<ResponseDto<U>> created(U data, String message) {
    return newResponse(HttpStatus.CREATED, data, message);
  }

  /** Constructs a ResponseEntity with HTTP status BAD_REQUEST (400). */
  public static <U> ResponseEntity<ResponseDto<U>> badRequest(U data, String message) {
    return newResponse(HttpStatus.BAD_REQUEST, data, message);
  }

  /** Constructs a ResponseEntity with HTTP status NOT_FOUND (404). */
  public static <U> ResponseEntity<ResponseDto<U>> notFound(U data, String message) {
    return newResponse(HttpStatus.NOT_FOUND, data, message);
  }

  /** Constructs a ResponseEntity with HTTP status INTERNAL_SERVER_ERROR (500). */
  public static <U> ResponseEntity<ResponseDto<U>> internalServerError(U data, String message) {
    return newResponse(HttpStatus.INTERNAL_SERVER_ERROR, data, message);
  }

  private static <U> ResponseEntity<ResponseDto<U>> newResponse(
      HttpStatus status, U data, String message) {
    return new ResponseEntity<>(new ResponseDto<>(status.value(), message, data), status);
  }
}
