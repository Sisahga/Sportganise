package com.sportganise.dto.forum;

import com.sportganise.entities.forum.Feedback;
import com.sportganise.entities.forum.PostType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ViewPostDto {
    @NotNull
    private Integer postId;
    @NotNull private String title;
    @NotNull private String description;
    private PostType type;
    private ZonedDateTime occurrenceDate;
    @NotNull private ZonedDateTime creationDate;
    @NotNull private Long likeCount;
    @NotNull private List<FeedbackDto> feedbackCount;
}
