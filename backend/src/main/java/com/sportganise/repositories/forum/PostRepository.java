package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Post;
import com.sportganise.entities.forum.PostType;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Post entity. */
@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

  /**
   * Fetches distinct types of posts.
   *
   * @return List of distinct types.
   */
  @Query("SELECT DISTINCT p.type FROM Post p")
  List<String> findDistinctTypes();

  /**
   * Fetches post by post id.
   *
   * @param postId Post id.
   * @return Post.
   */
  Post findByPostId(Integer postId);

  /**
   * Fetches posts based on search criteria.
   *
   * @param searchTerm Search term to filter posts by.
   * @param labels Labels to filter posts by.
   * @param selectedLabel Label selected to filter posts by.
   * @param occurrenceDate Date of occurrence of the post.
   * @param threeMonthsAgo Date three months ago.
   * @param yesterday Date yesterday.
   * @param absurdDate Absurd date.
   * @param type Type of the post.
   * @param pageable Pageable object.
   * @return Page of posts.
   */
  @Query(
      """
                SELECT p
                FROM Post p
                WHERE (CAST(:searchTerm AS STRING) IS NULL OR LOWER(p.title)
                    LIKE LOWER(CONCAT('%', CAST(:searchTerm AS STRING) , '%'))
                       OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:searchTerm AS STRING) , '%')))
            AND (:selectedLabel IS NULL OR p.postId IN(
                             SELECT pl.postLabelCompositeKey.postId
                             FROM PostLabel pl
                             WHERE pl.postLabelCompositeKey.labelId = :selectedLabel
                  ))     AND (:labels  IS NULL OR NOT EXISTS (
                             SELECT 1
                             FROM PostLabel pl
                             WHERE pl.postLabelCompositeKey.postId = p.postId
                             AND pl.postLabelCompositeKey.labelId NOT IN :labels
                  ))
                  AND( (CAST(:occurrenceDate AS TIMESTAMP)) = CAST(:absurdDate AS TIMESTAMP)
                      OR DATE(p.occurrenceDate) = DATE(CAST(:occurrenceDate AS TIMESTAMP)))
                  AND p.occurrenceDate BETWEEN CAST( :threeMonthsAgo AS TIMESTAMP)
                      AND CAST(  :yesterday AS TIMESTAMP)
                  AND (:type  IS NULL OR p.type = :type)
              """)
  Page<Post> searchAndFilterPosts(
      @Param("searchTerm") String searchTerm,
      @Param("labels") List<Integer> labels,
      @Param("selectedLabel") Integer selectedLabel,
      @Param("occurrenceDate") ZonedDateTime occurrenceDate,
      @Param("threeMonthsAgo") ZonedDateTime threeMonthsAgo,
      @Param("yesterday") ZonedDateTime yesterday,
      @Param("absurdDate") ZonedDateTime absurdDate,
      @Param("type") PostType type,
      Pageable pageable);

  @Modifying
  @Query(
      value =
          """
            INSERT INTO post (account_id, title, description, metadata, type, occurrence_date)
            VALUES (:accountId, :title, :description, CAST(:metadata AS JSON), :type, :occurrenceDate)
            """,
      nativeQuery = true)
  void insertPost(
      @Param("accountId") Integer accountId,
      @Param("title") String title,
      @Param("description") String description,
      @Param("metadata") String metadata,
      @Param("type") String type,
      @Param("occurrenceDate") ZonedDateTime occurrenceDate);
}
