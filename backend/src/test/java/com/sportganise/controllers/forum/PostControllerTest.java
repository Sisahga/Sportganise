package com.sportganise.controllers.forum;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.dto.forum.PostDto;
import com.sportganise.entities.forum.PostType;
import com.sportganise.services.forum.PostService;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
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
  public void searchAndFilterPosts_ShouldReturn_Posts() throws Exception {
    PostDto post1 =
        PostDto.builder()
            .postId(1)
            .title("Fundraiser for OniBad")
            .description("Join us for fundraiser this week!")
            .type(PostType.FUNDRAISER)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-26T05:05:40.658404Z"))
            .likeCount(2)
            .attachments(new ArrayList<>())
            .build();

    PostDto post2 =
        PostDto.builder()
            .postId(2)
            .title("Charity Gala Event")
            .description("Attend our charity gala and contribute to a noble cause this weekend.")
            .type(PostType.SPECIAL)
            .occurrenceDate(ZonedDateTime.parse("2025-01-20T10:30:00Z"))
            .creationDate(ZonedDateTime.parse("2025-01-26T05:05:40.658404Z"))
            .likeCount(1)
            .attachments(new ArrayList<>())
            .build();

    List<PostDto> posts = Arrays.asList(post1, post2);

    when(postService.searchAndFilterPosts(
            isNull(),
            isNull(),
            isNull(),
            isNull(),
            eq(10),
            eq(0),
            eq("occurrenceDate"),
            eq("desc"),
            eq(1L),
            eq(1L)))
        .thenReturn(posts);

    mockMvc
        .perform(get("/api/forum/posts/search").param("orgId", "1").param("accountId", "1"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.data.[0].title").value("Fundraiser for OniBad"))
        .andExpect(jsonPath("$.data.[1].title").value("Charity Gala Event"));
  }

  @Test
  public void getAllPostTypes_ShouldReturn_ListOfPostTypes() throws Exception {
    List<String> postTypes = Arrays.asList("FUNDRAISER", "SPECIAL", "ANNOUNCEMENT");

    when(postService.getAvailableTypes()).thenReturn(postTypes);

    mockMvc
        .perform(get("/api/forum/posts/types")) // Call the endpoint
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Post types fetched successfully"))
        .andExpect(jsonPath("$.data").isArray())
        .andExpect(jsonPath("$.data.[0]").value("FUNDRAISER"))
        .andExpect(jsonPath("$.data.[1]").value("SPECIAL"))
        .andExpect(jsonPath("$.data.[2]").value("ANNOUNCEMENT"));
  }
}
