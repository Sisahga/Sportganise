package com.sportganise.dto.forum;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFeedbackDto {
    private Integer postId;
    private Integer accountId;
    private String title;
    private String content;
}
