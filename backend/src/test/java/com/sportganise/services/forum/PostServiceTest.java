package com.sportganise.services.forum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sportganise.dto.forum.PostDto;
import com.sportganise.entities.forum.Post;
import com.sportganise.entities.forum.PostType;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.forum.LikesRepository;
import com.sportganise.repositories.forum.PostAttachmentRepository;
import com.sportganise.repositories.forum.PostRepository;
import java.lang.reflect.Method;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

  @Mock private PostRepository postRepository;

  @Mock private AccountRepository accountRepository;

  @Mock private LikesRepository likesRepository;

  @Mock private PostAttachmentRepository attachmentRepository;

  @Mock private FeedbackService feedbackService;

  @InjectMocks private PostService postService;

  @Test
  public void searchAndFilterPosts_ShouldReturn_AllPosts_WhenNoFiltersApplied() {

    Post post1 =
        Post.builder()
            .postId(1)
            .title("Fundraiser for OniBad")
            .description("Join us for fundraiser this week!")
            .type(PostType.FUNDRAISER)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    Post post2 =
        Post.builder()
            .postId(2)
            .title("Charity Gala Event")
            .description("Attend our charity gala this weekend.")
            .type(PostType.SPECIAL)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    List<Post> posts = Arrays.asList(post1, post2);
    Page<Post> postPage = new PageImpl<>(posts);
    ZonedDateTime absurdDate = ZonedDateTime.of(1, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC"));
    ZonedDateTime threeMonthsAgo = ZonedDateTime.parse("2025-01-02T10:30:00Z");
    ZonedDateTime yesterday = ZonedDateTime.parse("2025-01-20T10:30:00Z");

    when(postRepository.searchAndFilterPosts(
            any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
        .thenReturn(postPage);

    List<PostDto> result =
        postService.searchAndFilterPosts(
            null, null, null, null, 10, 0, "creationDate", "desc", 1L, 1L);

    assertEquals(2, result.size());
    assertEquals("Fundraiser for OniBad", result.get(0).getTitle());
    assertEquals("Charity Gala Event", result.get(1).getTitle());
  }

  @Test
  public void searchAndFilterPosts_ShouldReturn_SortedPosts_ByLikeCount() {
    Post post1 =
        Post.builder()
            .postId(1)
            .title("Fundraiser for OniBad")
            .description("Join us for fundraiser this week!")
            .type(PostType.FUNDRAISER)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    Post post2 =
        Post.builder()
            .postId(2)
            .title("Charity Gala Event")
            .description("Attend our charity gala this weekend.")
            .type(PostType.SPECIAL)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    List<Post> posts = Arrays.asList(post1, post2);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.searchAndFilterPosts(
            any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
        .thenReturn(postPage);

    List<PostDto> result =
        postService.searchAndFilterPosts(
            null, null, null, null, 10, 0, "likeCount", "desc", 1L, 1L);

    assertEquals(2, result.size());
    assertEquals("Fundraiser for OniBad", result.get(0).getTitle());
    assertEquals("Charity Gala Event", result.get(1).getTitle());
  }

  @Test
  public void searchAndFilterPosts_ShouldCallAccountRepository_WhenFetchingLabels() {
    Post post1 =
        Post.builder()
            .postId(1)
            .title("Fundraiser for OniBad")
            .description("Join us for fundraiser this week!")
            .type(PostType.FUNDRAISER)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    Post post2 =
        Post.builder()
            .postId(2)
            .title("Charity Gala Event")
            .description("Attend our charity gala this weekend.")
            .type(PostType.SPECIAL)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .build();
    List<Post> posts = Arrays.asList(post1, post2);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.searchAndFilterPosts(
            any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
        .thenReturn(postPage);

    postService.searchAndFilterPosts(null, null, null, null, 10, 0, "creationDate", "desc", 1L, 1L);

    verify(accountRepository, times(1)).getLabelIdsByAccountIdAndOrgId(1L, 1L);
  }

  @Test
  public void getThreeMonthsAgo_ShouldReturn_CorrectDate() throws Exception {
    Method method = PostService.class.getDeclaredMethod("getThreeMonthsAgo");
    method.setAccessible(true);

    ZonedDateTime result = (ZonedDateTime) method.invoke(postService);

    ZonedDateTime expectedDate = ZonedDateTime.now().minusMonths(3);
    assertEquals(expectedDate.toLocalDate(), result.toLocalDate()); // Compare dates only, not time
  }

  @Test
  public void getYesterday_ShouldReturn_CorrectDate() throws Exception {
    Method method = PostService.class.getDeclaredMethod("getYesterday");
    method.setAccessible(true);

    ZonedDateTime result = (ZonedDateTime) method.invoke(postService);

    ZonedDateTime expectedDate = ZonedDateTime.now().minusDays(1);
    assertEquals(expectedDate.toLocalDate(), result.toLocalDate()); // Compare dates only, not time
  }
}
