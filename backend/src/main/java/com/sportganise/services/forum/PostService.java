package com.sportganise.services.forum;

import com.sportganise.dto.forum.FeedbackDto;
import com.sportganise.dto.forum.PostDto;
import com.sportganise.dto.forum.ViewPostDto;
import com.sportganise.entities.forum.Likes;
import com.sportganise.entities.forum.LikesCompositeKey;
import com.sportganise.entities.forum.Post;
import com.sportganise.entities.forum.PostType;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.forum.LikesRepository;
import com.sportganise.repositories.forum.PostAttachmentRepository;
import com.sportganise.repositories.forum.PostRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/** Service class for handling Post related operations. */
@Slf4j
@Service
public class PostService {

  @Autowired private PostRepository postRepository;
  @Autowired private LikesRepository likesRepository;
  @Autowired private PostAttachmentRepository attachmentRepository;
  @Autowired private FeedbackService feedbackService;
  @Autowired private AccountRepository accountRepository;

  private static final ZonedDateTime ABSURD_DATE =
      ZonedDateTime.of(1, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC"));

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
   * @param sortDirection Direction to sort posts in.
   * @param orgId ID of the organization.
   * @param accountId ID of the account.
   * @return List of fetched posts.
   */
  public List<PostDto> searchAndFilterPosts(
      String searchTerm,
      ZonedDateTime occurrenceDate,
      PostType type,
      Integer selectedLabel,
      int limit,
      int page,
      String sortBy,
      String sortDirection,
      Integer orgId,
      Integer accountId) {

    log.info("Fetching posts with search criteria");

    List<Integer> labels = accountRepository.getLabelIdsByAccountIdAndOrgId(accountId, orgId);

    Sort sort =
        sortBy.equals("likeCount")
            ? Sort.unsorted()
            : Sort.by(Sort.Direction.fromString(sortDirection), sortBy);

    Pageable pageable = PageRequest.of(page, limit, sort);

    log.debug("Fetching posts with labels: {}", labels);
    log.debug("Fetching posts with selectedLabel: {}", selectedLabel);
    log.debug("Fetching posts with searchTerm: {}", searchTerm);
    log.debug("Fetching posts with occurrenceDate: {}", occurrenceDate);
    log.debug("If null, occurrenceDate will be set to: {}", ABSURD_DATE);
    log.debug("Fetching posts with type: {}", type);
    log.debug("Fetching posts with page: {}", page);
    log.debug("Fetching posts with limit: {}", limit);
    log.debug("Fetching posts with sortBy: {}", sortBy);
    log.debug("Fetching posts with sortDirection: {}", sortDirection);

    Page<Post> posts =
        postRepository.searchAndFilterPosts(
            searchTerm,
            labels,
            selectedLabel,
            occurrenceDate != null ? occurrenceDate : ABSURD_DATE,
            this.getThreeMonthsAgo(),
            this.getYesterday(),
            ABSURD_DATE,
            type,
            pageable);

    List<PostDto> dtos =
        posts.stream()
            .map(
                post -> {
                  long likeCount = countLikesByPostId(post.getPostId());
                  long feedbackCount = countFeedbackByPostId(post.getPostId());
                  boolean liked = likedPost(post.getPostId(), accountId);
                  PostDto dto =
                      new PostDto(
                          post.getPostId(),
                          post.getTitle(),
                          post.getDescription(),
                          post.getType(),
                          post.getOccurrenceDate(),
                          post.getCreationDate(),
                          likeCount,
                          liked,
                          feedbackCount);

                  return dto;
                })
            .collect(Collectors.toList());

    if (sortBy.equals("likeCount")) {
      dtos.sort(
          (a, b) ->
              sortDirection.equalsIgnoreCase("asc")
                  ? Long.compare(a.getLikeCount(), b.getLikeCount())
                  : Long.compare(b.getLikeCount(), a.getLikeCount()));
    }

    log.info("Fetched posts with search criteria");
    return dtos;
  }

  /**
   * Fetches all available post types.
   *
   * @return List of available post types.
   */
  public List<String> getAvailableTypes() {
    log.info("Fetching available post types");
    return postRepository.findDistinctTypes();
  }

  /**
   * Fetches a post by its id.
   *
   * @param postId Post id.
   * @return PostDto.
   */
  public ViewPostDto getPostByIdWithFeedBacks(Integer postId, Integer accountId) {
    List<FeedbackDto> feedbacks = feedbackService.getFeedbacksByPostId(postId);
    Long likeCount = countLikesByPostId(postId);
    Post post = getPostById(postId);
    boolean liked = likedPost(postId, accountId);
    return new ViewPostDto(
        post.getPostId(),
        post.getTitle(),
        post.getDescription(),
        post.getType(),
        post.getOccurrenceDate(),
        post.getCreationDate(),
        likeCount,
        liked,
        feedbacks.size(),
        feedbacks);
  }

  /**
   * Likes a post.
   *
   * @param postId Post id.
   * @param accountId Account id.
   */
  public void likePost(Integer postId, Integer accountId) {
    Likes like = new Likes();
    LikesCompositeKey likesCompositeKey = new LikesCompositeKey();
    likesCompositeKey.setAccountId(accountId);
    likesCompositeKey.setPostId(postId);
    like.setLikeCompositeKey(likesCompositeKey);
    likesRepository.save(like);
  }

  public void unlikePost(Integer postId, Integer accountId) {
    likesRepository.deleteByPostIdAndAccountId(postId, accountId);
  }

  private boolean likedPost(Integer postId, Integer accountId) {
    return likesRepository.findByPostIdAndAccountId(postId, accountId) != null;
  }

  /**
   * Fetches a post by its id.
   *
   * @param postId Post id.
   * @return Post entity.
   */
  private Post getPostById(Integer postId) {
    return postRepository
        .findById(postId)
        .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
  }

  /**
   * Counts the number of likes for a post.
   *
   * @param postId Post id.
   * @return Number of likes.
   */
  private Long countLikesByPostId(Integer postId) {
    return likesRepository.countByPostId(postId);
  }

  /**
   * Counts the number of feedbacks for a post.
   *
   * @param postId Post id.
   * @return Number of feedbacks.
   */
  private Long countFeedbackByPostId(Integer postId) {
    return feedbackService.countFeedbackByPostId(postId);
  }

  /**
   * Fetches the date three months ago.
   *
   * @return The date three months ago.
   */
  private ZonedDateTime getThreeMonthsAgo() {
    log.debug("Fetching date three months ago");
    return ZonedDateTime.now().minusMonths(3);
  }

  /**
   * Fetches the date yesterday.
   *
   * @return The date yesterday.
   */
  private ZonedDateTime getYesterday() {
    log.debug("Fetching date yesterday");
    return ZonedDateTime.now().minusDays(1);
  }
}
