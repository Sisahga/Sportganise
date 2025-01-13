package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Post entity. */
@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

  /**
   * Search posts by title or description.
   *
   * @param searchTerm search term
   * @param pageable pagination information
   * @return page of posts
   */
  @Query(
      "SELECT p FROM Post p WHERE "
          + "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
          + "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  Page<Post> searchPosts(@Param("searchTerm") String searchTerm, Pageable pageable);
}
