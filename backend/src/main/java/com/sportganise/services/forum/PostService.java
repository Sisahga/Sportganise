package com.sportganise.services.forum;

import com.sportganise.entities.forum.Post;
import com.sportganise.repositories.forum.PostRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/** Service class for handling Post related operations. */
@Service
public class PostService {

  @Autowired private PostRepository postRepository;

  /**
   * Search posts by title or description.
   *
   * @param searchTerm search term
   * @param limit limit the number of posts to return
   * @param page page number to return
   * @param sortBy field to sort by
   * @param sortDir sort direction
   * @return list of posts
   */
  public List<Post> searchPosts(
      String searchTerm, Integer limit, Integer page, String sortBy, String sortDir) {
    Pageable pageable;

    if ((sortBy == null || sortBy.isEmpty()) && (sortDir == null || sortDir.isEmpty())) {
      pageable =
          (limit == null || limit <= 0)
              ? Pageable.unpaged()
              : PageRequest.of(page != null ? page : 0, limit);
    } else {
      Sort sort =
          Sort.by(
              sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
      pageable =
          (limit == null || limit <= 0)
              ? Pageable.unpaged()
              : PageRequest.of(page != null ? page : 0, limit, sort);
    }

    return postRepository.searchPosts(searchTerm, pageable).getContent();
  }
}
