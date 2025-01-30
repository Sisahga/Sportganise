package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Likes entity. */
@Repository
public interface LikesRepository extends JpaRepository<Likes, Integer> {

  /**
   * Counts the number of likes for a post.
   *
   * @param postId Post id.
   * @return Number of likes.
   */
  @Query(
      """
      SELECT COUNT(l)
      FROM Likes l
      WHERE l.likeCompositeKey.postId = :postId
      """)
  Long countByPostId(@Param("postId") Integer postId);
}
