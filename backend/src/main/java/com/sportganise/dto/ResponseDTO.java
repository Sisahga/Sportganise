package com.sportganise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * ResponseDTO
 */
@Data
@NoArgsConstructor  // Generates a no-argument constructor
@AllArgsConstructor
public class ResponseDTO <T>{
    private int statusCode;
    private String message;
    private T data;

}