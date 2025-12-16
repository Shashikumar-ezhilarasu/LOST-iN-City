package com.lostcity.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private T data;
    private MetaData meta;
    @Builder.Default
    private List<ErrorDetail> errors = new ArrayList<>();

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(T data, MetaData meta) {
        return ApiResponse.<T>builder()
                .data(data)
                .meta(meta)
                .build();
    }

    public static <T> ApiResponse<T> error(List<ErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .errors(errors)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetaData {
        private Integer page;
        private Integer pageSize;
        private Long total;
        private Integer scoreDelta;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetail {
        private String code;
        private String message;
        private String field;
    }
}
