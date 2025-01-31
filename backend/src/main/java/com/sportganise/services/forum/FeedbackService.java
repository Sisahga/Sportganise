package com.sportganise.services.forum;

import com.sportganise.repositories.forum.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service class for handling Feedback related operations. */
@Service
public class FeedbackService {

  @Autowired private FeedbackRepository feedbackRepository;

  /**
   * Counts the number of feedbacks for a post.
   *
   * @param postId Post id.
   * @return Number of feedbacks.
   */
  public long countFeedbackByPostId(Integer postId) {
    return feedbackRepository.countByPostId(postId);
  }
}
