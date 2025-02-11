package com.sportganise.services.forum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sportganise.dto.forum.CreateFeedbackDto;
import com.sportganise.dto.forum.FeedbackDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.forum.Feedback;
import com.sportganise.repositories.forum.FeedbackRepository;
import com.sportganise.services.account.AccountService;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
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
  @Mock private AccountService accountService;

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

  @Test
  public void createFeedback_ShouldSaveFeedback() {
    CreateFeedbackDto createFeedbackDto = new CreateFeedbackDto(1, "Great post!");
    Feedback feedback = new Feedback();
    feedback.setContent(createFeedbackDto.getContent());
    feedback.setPostId(2);
    feedback.setUserId(createFeedbackDto.getAccountId());

    feedbackService.createFeedback(createFeedbackDto, 2);

    verify(feedbackRepository, times(1)).save(any(Feedback.class));
  }

  @Test
  public void getFeedbacksByPostId_ShouldReturnFeedbackDtos() {
    ZonedDateTime date1 = ZonedDateTime.of(2021, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC"));
    ZonedDateTime date2 = ZonedDateTime.of(2022, 1, 2, 0, 0, 0, 0, ZoneId.of("UTC"));
    Feedback feedback1 =
        Feedback.builder()
            .feedbackId(1)
            .content("Nice post!")
            .postId(1)
            .userId(2)
            .creationDate(date1)
            .build();
    Feedback feedback2 =
        Feedback.builder()
            .feedbackId(2)
            .content("Interesting!")
            .postId(1)
            .userId(3)
            .creationDate(date2)
            .build();
    Account account1 =
        Account.builder()
            .accountId(2)
            .firstName("John")
            .lastName("Doe")
            .type(AccountType.valueOf("COACH"))
            .pictureUrl("url")
            .build();
    Account account2 =
        Account.builder()
            .accountId(3)
            .firstName("Jane")
            .lastName("Smith")
            .type(AccountType.valueOf("ADMIN"))
            .pictureUrl("url")
            .build();

    List<Feedback> feedbacks = Arrays.asList(feedback2, feedback1);

    when(feedbackRepository.findFeedbacksByPostIdOrderByCreationDateDesc(1)).thenReturn(feedbacks);
    when(accountService.getAccountById(2)).thenReturn(account1);
    when(accountService.getAccountById(3)).thenReturn(account2);

    List<FeedbackDto> result = feedbackService.getFeedbacksByPostId(1);

    assertEquals(2, result.size());

    assertEquals("Interesting!", result.get(0).getDescription());
    assertEquals("Jane Smith", result.get(0).getAuthor().getName());

    assertEquals("Nice post!", result.get(1).getDescription());
    assertEquals("John Doe", result.get(1).getAuthor().getName());
  }

  @Test
  public void deleteFeedbackByPostIdFeedbackId_ShouldCallRepositoryDelete() {
    feedbackService.deleteFeedbackByPostIdFeedbackId(1, 2);
    verify(feedbackRepository, times(1)).deleteByPostIdAndFeedbackId(1, 2);
  }
}
