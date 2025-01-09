package com.sportganise.controllers.directmessaging;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import com.sportganise.services.directmessaging.DirectMessageService;
import java.time.ZonedDateTime;
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
  @MockBean private DirectMessageService dmService;

  private ObjectMapper objectMapper;

  CreateDirectMessageChannelDto createDmChannelDTO;

  @BeforeEach
  public void setup() {
    objectMapper = new ObjectMapper();
    createDmChannelDTO = new CreateDirectMessageChannelDto();
    List<Integer> memberIds = Arrays.asList(1, 2);
    createDmChannelDTO.setMemberIds(memberIds);
    createDmChannelDTO.setChannelName("Test Channel");
    createDmChannelDTO.setChannelType("SIMPLE");
  }

  @Test
  public void createDirectMessageChannelTest() throws Exception {
    given(
            dmChannelService.createDirectMessageChannel(
                createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName(), 1))
        .willReturn(createDmChannelDTO);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/messaging/channel/create-channel/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(createDmChannelDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.channelName", is(createDmChannelDTO.getChannelName())))
        .andExpect(jsonPath("$.channelType", is(createDmChannelDTO.getChannelType())))
        .andExpect(jsonPath("$.memberIds", is(createDmChannelDTO.getMemberIds())))
        .andExpect(jsonPath("$.memberIds.length()").value(2))
        .andReturn();
    verify(dmChannelService, times(1))
        .createDirectMessageChannel(
            createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName(), 1);
  }

  @Test
  public void deleteDirectMessageChannelTest_ChannelExists() throws Exception {
    int channelId = 1;
    given(dmChannelService.deleteDirectMessageChannel(channelId)).willReturn(true);
    mockMvc
        .perform(
            MockMvcRequestBuilders.delete("/api/messaging/channel/delete-channel/" + channelId))
        .andExpect(status().isNoContent());
    verify(dmChannelService, times(1)).deleteDirectMessageChannel(channelId);
  }

  @Test
  public void deleteDirectMessageChannelTest_NoChannels() throws Exception {
    int channelId = 1;
    given(dmChannelService.deleteDirectMessageChannel(channelId)).willReturn(false);
    mockMvc
        .perform(
            MockMvcRequestBuilders.delete("/api/messaging/channel/delete-channel/" + channelId))
        .andExpect(status().isNotFound());
    verify(dmChannelService, times(1)).deleteDirectMessageChannel(channelId);
  }

  @Test
  public void getDirectMessageChannelsTest() throws Exception {
    int accountId = 1;

    ListDirectMessageChannelDto channel1 =
        new ListDirectMessageChannelDto(
            1, "GROUP", "Channel 1", "image_blob_1", "I love you.", false, ZonedDateTime.now());
    ListDirectMessageChannelDto channel2 =
        new ListDirectMessageChannelDto(2, "SIMPLE", "Channel 2", null, null, true, null);
    List<ListDirectMessageChannelDto> expectedChannels = Arrays.asList(channel1, channel2);

    given(dmChannelService.getDirectMessageChannels(accountId)).willReturn(expectedChannels);
    mockMvc
        .perform(MockMvcRequestBuilders.get("/api/messaging/channel/get-channels/" + accountId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].channelId", is(channel1.getChannelId())))
        .andExpect(jsonPath("$[0].channelType", is(channel1.getChannelType())))
        .andExpect(jsonPath("$[0].channelName", is(channel1.getChannelName())))
        .andExpect(jsonPath("$[0].channelImageBlob", is(channel1.getChannelImageBlob())))
        .andExpect(jsonPath("$[0].lastMessage", is(channel1.getLastMessage())))
        .andExpect(jsonPath("$[0].read", is(channel1.getRead())))
        .andExpect(jsonPath("$[1].channelId", is(channel2.getChannelId())))
        .andExpect(jsonPath("$[1].channelType", is(channel2.getChannelType())))
        .andExpect(jsonPath("$[1].channelName", is(channel2.getChannelName())))
        .andExpect(jsonPath("$[1].channelImageBlob", is(channel2.getChannelImageBlob())))
        .andExpect(jsonPath("$[1].lastMessage", is(channel2.getLastMessage())))
        .andExpect(jsonPath("$[1].read", is(channel2.getRead())));
    verify(dmChannelService, times(1)).getDirectMessageChannels(accountId);
  }

  @Test
  public void getDirectMessageChannelsTest_NoChannels() throws Exception {
    int accountId = 1;
    given(dmChannelService.getDirectMessageChannels(accountId)).willReturn(null);
    mockMvc
        .perform(MockMvcRequestBuilders.get("/api/messaging/channel/get-channels/" + accountId))
        .andExpect(status().isOk())
        .andExpect(content().string(""));
    verify(dmChannelService, times(1)).getDirectMessageChannels(accountId);
  }
}
