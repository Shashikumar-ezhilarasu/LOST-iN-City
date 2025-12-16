package com.lostcity.exception;

import com.lostcity.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        List<ApiResponse.ErrorDetail> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(ApiResponse.ErrorDetail.builder()
                    .code("VALIDATION_ERROR")
                    .field(fieldName)
                    .message(errorMessage)
                    .build());
        });
        return ResponseEntity.badRequest().body(ApiResponse.error(errors));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        List<ApiResponse.ErrorDetail> errors = List.of(
                ApiResponse.ErrorDetail.builder()
                        .code("RUNTIME_ERROR")
                        .message(ex.getMessage())
                        .build());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(errors));
    }

    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(Exception ex) {
        List<ApiResponse.ErrorDetail> errors = List.of(
                ApiResponse.ErrorDetail.builder()
                        .code("AUTHENTICATION_ERROR")
                        .message("Invalid email or password")
                        .build());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        List<ApiResponse.ErrorDetail> errors = List.of(
                ApiResponse.ErrorDetail.builder()
                        .code("INTERNAL_ERROR")
                        .message("An unexpected error occurred")
                        .build());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(errors));
    }
}
