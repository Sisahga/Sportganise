package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
