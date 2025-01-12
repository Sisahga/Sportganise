package com.sportganise.controllers.forum;

import com.sportganise.entities.forum.Post;
import com.sportganise.services.forum.PostService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller for handling HTTP requests related to Posts. */
@RestController
@RequestMapping("api/forum/posts")
public class PostController {

  @Autowired private PostService postService;

  /**
   * Endpoint /api/forum/posts/search: Get Mapping for Searching Posts.
   *
   * @param searchTerm Search term to search for in the posts.
   * @param limit Limit the number of posts to return.
   * @param page Page number to return.
   * @param sortBy Field to sort by.
   * @param sortDir Sort direction.
   * @return List of Posts.
   */
  @GetMapping("/search")
  public ResponseEntity<List<Post>> searchPosts(
      @RequestParam String searchTerm,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String sortDir) {
    List<Post> posts = postService.searchPosts(searchTerm, limit, page, sortBy, sortDir);
    return ResponseEntity.ok(posts);
  }
}
