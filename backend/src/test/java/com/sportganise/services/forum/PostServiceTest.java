package com.sportganise.services.forum;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.sportganise.entities.forum.Post;
import com.sportganise.repositories.forum.PostRepository;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PostServiceTest {

  @Mock private PostRepository postRepository;

  @InjectMocks private PostService postService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testSearchPostsWithoutSortingOrPagination() {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post1, post2);
    Pageable pageable = PageRequest.of(0, 10);

    when(postRepository.searchPosts(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(posts, pageable, posts.size()));

    List<Post> result = postService.searchPosts("fundraiser", null, null, null, null);

    verify(postRepository, times(1)).searchPosts(any(), any(Pageable.class));
    assert result.size() == 2;
    assert result.get(0).getTitle().equals("Fundraiser for OniBad");
  }

  @Test
  public void testSearchPostsWithPagination() {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post1, post2);

    Pageable pageable = PageRequest.of(0, 1);

    when(postRepository.searchPosts(any(), eq(pageable)))
        .thenReturn(new PageImpl<>(posts.subList(0, 1), pageable, posts.size()));

    List<Post> result = postService.searchPosts("training", 1, 0, null, null);

    verify(postRepository, times(1)).searchPosts(any(), eq(pageable));
    assert result.size() == 1;
    assert result.get(0).getTitle().equals("Fundraiser for OniBad");
  }

  @Test
  public void testSearchPostsWithSorting() {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post2, post1);
    Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "title"));

    when(postRepository.searchPosts(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(posts, pageable, posts.size()));

    List<Post> result = postService.searchPosts("training", null, null, "title", "desc");

    verify(postRepository, times(1)).searchPosts(any(), any(Pageable.class));
    assert result.size() == 2;
    assert result.get(0).getTitle().equals("Sunday Training");
  }

  @Test
  public void testSearchPostsWithNoResults() {
    Pageable pageable = PageRequest.of(0, 10);
    List<Post> posts = Arrays.asList();

    when(postRepository.searchPosts(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(posts, pageable, posts.size()));

    List<Post> result = postService.searchPosts("nonexistent", 10, 0, null, null);

    verify(postRepository, times(1)).searchPosts(any(), any(Pageable.class));
    assert result.size() == 0;
  }
}
