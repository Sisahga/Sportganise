package com.sportganise.controllers.forum;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.entities.forum.Post;
import com.sportganise.services.forum.PostService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class PostControllerTest {

  private MockMvc mockMvc;

  @Mock private PostService postService;

  @InjectMocks private PostController postController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
  }

  @Test
  public void testSearchPostsWithoutPaginationAndSorting() throws Exception {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post1, post2);

    when(postService.searchPosts(anyString(), eq(null), eq(null), eq(null), eq(null)))
        .thenReturn(posts);

    mockMvc
        .perform(get("/api/forum/posts/search").param("searchTerm", "fundraiser"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].title").value("Fundraiser for OniBad"))
        .andExpect(jsonPath("$[1].title").value("Sunday Training"));
  }

  @Test
  public void testSearchPostsWithPagination() throws Exception {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post1, post2);

    when(postService.searchPosts(eq("training"), eq(1), eq(0), eq(null), eq(null)))
        .thenReturn(posts);

    mockMvc
        .perform(
            get("/api/forum/posts/search")
                .param("searchTerm", "training")
                .param("limit", "1")
                .param("page", "0"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].title").value("Fundraiser for OniBad"));
  }

  @Test
  public void testSearchPostsWithSorting() throws Exception {
    Post post1 = new Post("Fundraiser for OniBad", "Join us for fundraiser this week!");
    Post post2 = new Post("Sunday Training", "This week we did usual intensive training.");
    List<Post> posts = Arrays.asList(post2, post1);

    when(postService.searchPosts(eq("training"), eq(null), eq(null), eq("title"), eq("desc")))
        .thenReturn(posts);

    mockMvc
        .perform(
            get("/api/forum/posts/search")
                .param("searchTerm", "training")
                .param("sortBy", "title")
                .param("sortDir", "desc"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].title").value("Sunday Training"))
        .andExpect(jsonPath("$[1].title").value("Fundraiser for OniBad"));
  }

  @Test
  public void testSearchPostsWithNoResults() throws Exception {
    List<Post> posts = Arrays.asList(); // No posts returned

    when(postService.searchPosts(eq("nonexistent"), eq(null), eq(null), eq(null), eq(null)))
        .thenReturn(posts);

    mockMvc
        .perform(get("/api/forum/posts/search").param("searchTerm", "nonexistent"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$").isEmpty());
  }
}
