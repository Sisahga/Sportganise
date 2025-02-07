package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Feedback;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/** Repository for Feedback entity. */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

  /**
   * Counts the number of feedbacks for a post.
   *
   * @param postId Post id.
   * @return Number of feedbacks.
   */
  long countByPostId(Integer postId);

  /**
   * Fetches feedback by feedback id.
   *
   * @param feedbackId Feedback id.
   * @return Feedback.
   */
  <Optional> Feedback findByFeedbackId(Integer feedbackId);

  /**
   * Fetches feedbacks by post id.
   *
   * @param postId Post id.
   * @return List of feedbacks.
   */
  <Optional> List<Feedback> findFeedbacksByPostId(Integer postId);

  /**
   * Deletes feedback by post id.
   *
   * @param postId Post id.
   */
  @Modifying
  @Transactional
  @Query("DELETE FROM Feedback f WHERE f.postId = :postId AND f.feedbackId = :feedbackId")
  void deleteByPostIdAndFeedbackId(Integer postId, Integer feedbackId);
}
