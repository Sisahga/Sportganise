package com.sportganise.controllers.forum;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.forum.CreateFeedbackDto;
import com.sportganise.dto.forum.FeedbackIdDto;
import com.sportganise.dto.forum.LikeRequestDto;
import com.sportganise.dto.forum.PostDto;
import com.sportganise.dto.forum.ViewPostDto;
import com.sportganise.entities.forum.PostType;
import com.sportganise.services.forum.FeedbackService;
import com.sportganise.services.forum.PostService;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller for handling HTTP requests related to Posts. */
@RestController
@RequestMapping("api/forum/posts")
public class PostController {

  @Autowired private PostService postService;
  @Autowired private FeedbackService feedbackService;

  /**
   * Fetches posts based on search criteria.
   *
   * @param searchTerm Search term to filter posts by.
   * @param occurrenceDate Date of occurrence of the post.
   * @param type Type of the post.
   * @param selectedLabel Label selected to filter posts by.
   * @param limit Number of posts to fetch.
   * @param page Page number of posts to fetch.
   * @param sortBy Field to sort posts by.
   * @param sortDir Direction to sort posts in.
   * @param orgId ID of the organization.
   * @param accountId ID of the account.
   * @return ResponseDto containing the fetched posts.
   */
  @GetMapping("/search/{orgId}/{accountId}")
  public ResponseEntity<ResponseDto<List<PostDto>>> searchAndFilterPosts(
      @RequestParam(required = false) String searchTerm,
      @RequestParam(required = false) ZonedDateTime occurrenceDate,
      @RequestParam(required = false) PostType type,
      @RequestParam(required = false) Integer selectedLabel,
      @RequestParam(defaultValue = "10") int limit,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "occurrenceDate") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir,
      @PathVariable Integer orgId,
      @PathVariable Integer accountId) {
    List<PostDto> postDtos =
        postService.searchAndFilterPosts(
            searchTerm,
            occurrenceDate,
            type,
            selectedLabel,
            limit,
            page,
            sortBy,
            sortDir,
            orgId,
            accountId);
    ResponseDto<List<PostDto>> responseDto = new ResponseDto<>();
    responseDto.setData(postDtos);
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Posts fetched successfully");

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Fetches all available post types.
   *
   * @return ResponseDto containing the fetched post types.
   */
  @GetMapping("/types")
  public ResponseDto<List<String>> getAllPostTypes() {
    List<String> types = postService.getAvailableTypes();
    ResponseDto<List<String>> responseDto = new ResponseDto<>();
    responseDto.setData(types);
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Post types fetched successfully");

    return responseDto;
  }

  /**
   * Fetches a post by post id.
   *
   * @param postId Post id.
   * @return ResponseDto containing the fetched post.
   */
  @GetMapping("/{postId}/{accountId}")
  public ResponseEntity<ResponseDto<ViewPostDto>> getPostById(
      @PathVariable Integer postId, @PathVariable Integer accountId) {
    ViewPostDto viewPostDto = postService.getPostByIdWithFeedBacks(postId, accountId);
    ResponseDto<ViewPostDto> responseDto = new ResponseDto<>();
    responseDto.setData(viewPostDto);
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Post fetched successfully");

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Like a post.
   *
   * @param postId Post id.
   * @param likeRequestDto Like request data.
   * @return ResponseDto .
   */
  @PostMapping("/{postId}/like")
  public ResponseDto<String> likePost(
      @PathVariable Integer postId, @RequestBody LikeRequestDto likeRequestDto) {
    postService.likePost(postId, likeRequestDto.getAccountId());
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.CREATED.value());
    responseDto.setMessage("Post liked successfully");

    return responseDto;
  }

  /**
   * Unlike a post.
   *
   * @param postId Post Id.
   * @param accountId Account Id.
   * @return ResponseDto .
   */
  @DeleteMapping("/{postId}/unlike/{accountId}")
  public ResponseDto<String> unlikePost(
      @PathVariable Integer postId, @PathVariable Integer accountId) {
    postService.unlikePost(postId, accountId);
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.NO_CONTENT.value());
    responseDto.setMessage("Post unliked successfully");

    return responseDto;
  }

  /**
   * Create a feedback instance.
   *
   * @param postId Post Id.
   * @param feedback Feedback data.
   * @return ResponseDto .
   */
  @PostMapping("/{postId}/add-feedback")
  public ResponseEntity<ResponseDto<FeedbackIdDto>> createFeedback(
      @PathVariable Integer postId, @RequestBody CreateFeedbackDto feedback) {
    FeedbackIdDto feedbackIdDto =
        new FeedbackIdDto(feedbackService.createFeedback(feedback, postId));
    ResponseDto<FeedbackIdDto> responseDto = new ResponseDto<>();
    responseDto.setData(feedbackIdDto);
    responseDto.setStatusCode(HttpStatus.CREATED.value());
    responseDto.setMessage("Feedback added successfully");

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Fetches feedbacks by post id.
   *
   * @param postId Post id.
   * @return ResponseDto containing the fetched feedbacks.
   */
  @DeleteMapping("/{postId}/delete-feedback/{feedbackId}")
  public ResponseDto<String> deleteFeedback(
      @PathVariable Integer postId, @PathVariable Integer feedbackId) {
    feedbackService.deleteFeedbackByPostIdFeedbackId(postId, feedbackId);
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.NO_CONTENT.value());
    responseDto.setMessage("Feedback deleted successfully");

    return responseDto;
  }
}
