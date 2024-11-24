package com.sportganise.controllers.directmessaging;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = DirectMessageChannelController.class)
@AutoConfigureMockMvc
class DirectMessageChannelControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private DirectMessageChannelService dmChannelService;

  private ObjectMapper objectMapper;

  CreateDirectMessageChannelDto createDmChannelDTO;

  @BeforeEach
  public void setup() {
    objectMapper = new ObjectMapper();
    createDmChannelDTO = new CreateDirectMessageChannelDto();
    List<Integer> memberIds = Arrays.asList(1, 2);
    createDmChannelDTO.setMemberIds(memberIds);
    createDmChannelDTO.setChannelName("Test Channel");
  }

  @Test
  public void createDirectMessageChannelTest() throws Exception {
    given(
            dmChannelService.createDirectMessageChannel(
                createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName()))
        .willReturn(createDmChannelDTO);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/messaging/create-channel")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(createDmChannelDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.channelName", is(createDmChannelDTO.getChannelName())))
        .andExpect(jsonPath("$.memberIds", is(createDmChannelDTO.getMemberIds())))
        .andExpect(jsonPath("$.memberIds.length()").value(2))
        .andReturn();
    verify(dmChannelService, times(1))
        .createDirectMessageChannel(
            createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName());
  }

  @Test
  public void deleteDirectMessageChannelTest_ChannelExists() throws Exception {
    int channelId = 1;
    given(dmChannelService.deleteDirectMessageChannel(channelId)).willReturn(true);
    mockMvc
        .perform(MockMvcRequestBuilders.delete("/api/messaging/delete-channel/" + channelId))
        .andExpect(status().isNoContent());
    verify(dmChannelService, times(1)).deleteDirectMessageChannel(channelId);
  }

  @Test
  public void deleteDirectMessageChannelTest_ChannelDoesNotExists() throws Exception {
    int channelId = 1;
    given(dmChannelService.deleteDirectMessageChannel(channelId)).willReturn(false);
    mockMvc
        .perform(MockMvcRequestBuilders.delete("/api/messaging/delete-channel/" + channelId))
        .andExpect(status().isNotFound());
    verify(dmChannelService, times(1)).deleteDirectMessageChannel(channelId);
  }
}
