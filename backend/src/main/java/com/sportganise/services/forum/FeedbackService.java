package com.sportganise.services.forum;

import com.sportganise.dto.forum.CreateFeedbackDto;
import com.sportganise.dto.forum.FeedbackAuthorDto;
import com.sportganise.dto.forum.FeedbackDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.forum.Feedback;
import com.sportganise.repositories.forum.FeedbackRepository;
import com.sportganise.services.account.AccountService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service class for handling Feedback related operations. */
@Service
public class FeedbackService {

  @Autowired private FeedbackRepository feedbackRepository;
  @Autowired private AccountService accountService;

  /**
   * Counts the number of feedbacks for a post.
   *
   * @param postId Post id.
   * @return Number of feedbacks.
   */
  public long countFeedbackByPostId(Integer postId) {
    return feedbackRepository.countByPostId(postId);
  }

  /**
   * Deletes feedback by feedback id.
   *
   * @param feedbackId Feedback id.
   */
  public void deleteFeedbackByPostIdFeedbackId(Integer postId, Integer feedbackId) {
    feedbackRepository.deleteByPostIdAndFeedbackId(postId, feedbackId);
  }

  /**
   * Create a feedback instance.
   *
   * @param createFeedbackDto feedback data
   */
  public Integer createFeedback(CreateFeedbackDto createFeedbackDto, Integer postId) {
    Feedback feedback = new Feedback();
    feedback.setContent(createFeedbackDto.getContent());
    feedback.setPostId(postId);
    feedback.setUserId(createFeedbackDto.getAccountId());
    Feedback savedFeedback = feedbackRepository.save(feedback);

    return savedFeedback.getFeedbackId();
  }

  /**
   * Fetches feedbacks by post id.
   *
   * @param postId Post id.
   * @return List of feedbacks.
   */
  public List<FeedbackDto> getFeedbacksByPostId(Integer postId) {
    List<Feedback> feedbacks =
        feedbackRepository.findFeedbacksByPostIdOrderByCreationDateDesc(postId);
    return feedbacks.stream().map(this::convertFeedbackToDto).collect(Collectors.toList());
  }

  /**
   * Converts a Feedback entity to a FeedbackDto.
   *
   * @param feedback Feedback entity.
   */
  private FeedbackDto convertFeedbackToDto(Feedback feedback) {
    Account account = accountService.getAccountById(feedback.getUserId());
    return FeedbackDto.builder()
        .feedbackId(feedback.getFeedbackId())
        .description(feedback.getContent())
        .author(
            FeedbackAuthorDto.builder()
                .accountId(account.getAccountId())
                .name(getAuthorName(account.getAccountId()))
                .type(account.getType())
                .pictureUrl(account.getPictureUrl())
                .build())
        .creationDate(feedback.getCreationDate())
        .build();
  }

  /**
   * Fetches the author name of a feedback.
   *
   * @param accountId Account id.
   * @return Author name.
   */
  private String getAuthorName(Integer accountId) {
    Account account = accountService.getAccountById(accountId);
    return account.getFirstName() + " " + account.getLastName();
  }
}
