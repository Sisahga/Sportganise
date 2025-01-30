package com.sportganise.services.forum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sportganise.repositories.forum.FeedbackRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

  @Mock private FeedbackRepository feedbackRepository;

  @InjectMocks private FeedbackService feedbackService;

  @Test
  public void getFeedbackCountByPostId_shouldReturnCorrectCount() {
    Integer postId = 1;
    long expectedCount = 5;
    when(feedbackRepository.countByPostId(postId)).thenReturn(expectedCount);

    long actualCount = feedbackService.countFeedbackByPostId(postId);

    assertEquals(expectedCount, actualCount);

    verify(feedbackRepository, times(1)).countByPostId(postId);
  }
}
