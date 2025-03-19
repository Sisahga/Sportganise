package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Likes;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

  /**
   * Deletes like by post id and account id.
   *
   * @param postId Post id.
   * @param accountId Account id.
   */
  @Modifying
  @Transactional
  @Query(
      """
        DELETE
        FROM Likes l
        WHERE l.likeCompositeKey.postId = :postId AND l.likeCompositeKey.accountId = :accountId
        """)
  void deleteByPostIdAndAccountId(Integer postId, Integer accountId);

  /**
   * Finds a like by post id and account id.
   *
   * @param postId Post id.
   * @param accountId Account id.
   * @return Like entity.
   */
  @Query(
      """
        SELECT l
        FROM Likes l
        WHERE l.likeCompositeKey.postId = :postId AND l.likeCompositeKey.accountId = :accountId
        """)
  Likes findByPostIdAndAccountId(Integer postId, Integer accountId);
}
