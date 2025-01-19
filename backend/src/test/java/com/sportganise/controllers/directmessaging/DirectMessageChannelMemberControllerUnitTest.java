package com.sportganise.controllers.directmessaging;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = DirectMessageChannelMemberController.class)
@AutoConfigureMockMvc
class DirectMessageChannelMemberControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private DirectMessageChannelMemberService directMessageChannelMemberService;

  @Test
  public void getChannelMembers_ShouldReturnMembersExcludingUser() throws Exception {
    int channelId = 1;
    int accountId = 100;
    List<ChannelMembersDto> expectedMembers =
        Arrays.asList(new ChannelMembersDto(), new ChannelMembersDto());

    given(directMessageChannelMemberService.getNonUserChannelMembers(channelId, accountId))
        .willReturn(expectedMembers);

    mockMvc
        .perform(
            MockMvcRequestBuilders.get(
                "/api/messaging/channelmember/get-channel-members/" + channelId + "/" + accountId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode", is(200)))
        .andExpect(jsonPath("$.message", is("Channel members retrieved successfully")))
        .andExpect(jsonPath("$.data.length()").value(2));

    verify(directMessageChannelMemberService, times(1))
        .getNonUserChannelMembers(channelId, accountId);
  }

  @Test
  public void getAllChannelMembers_ShouldReturnAllMembers() throws Exception {
    int channelId = 1;
    List<ChannelMembersDto> expectedMembers =
        Arrays.asList(new ChannelMembersDto(), new ChannelMembersDto(), new ChannelMembersDto());

    given(directMessageChannelMemberService.getAllChannelMembers(channelId))
        .willReturn(expectedMembers);

    mockMvc
        .perform(
            MockMvcRequestBuilders.get(
                "/api/messaging/channelmember/get-channel-members/" + channelId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode", is(200)))
        .andExpect(jsonPath("$.message", is("Channel members retrieved successfully")))
        .andExpect(jsonPath("$.data.length()").value(3));

    verify(directMessageChannelMemberService, times(1)).getAllChannelMembers(channelId);
  }

  @Test
  public void markChannelAsRead_WhenSuccessful_ShouldReturnOk() throws Exception {
    int channelId = 1;
    int accountId = 100;

    given(directMessageChannelMemberService.markChannelAsRead(channelId, accountId)).willReturn(1);

    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                "/api/messaging/channelmember/" + channelId + "/" + accountId + "/mark-as-read"))
        .andExpect(status().isOk());

    verify(directMessageChannelMemberService, times(1)).markChannelAsRead(channelId, accountId);
  }

  @Test
  public void markChannelAsRead_WhenNoRowsUpdated_ShouldReturnNotFound() throws Exception {
    int channelId = 1;
    int accountId = 100;

    given(directMessageChannelMemberService.markChannelAsRead(channelId, accountId)).willReturn(0);

    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                "/api/messaging/channelmember/" + channelId + "/" + accountId + "/mark-as-read"))
        .andExpect(status().isNotFound());

    verify(directMessageChannelMemberService, times(1)).markChannelAsRead(channelId, accountId);
  }

  @Test
  public void removeChannelMember_ShouldReturnOkStatus() throws Exception {
    int channelId = 1;
    int accountId = 100;

    mockMvc
        .perform(
            MockMvcRequestBuilders.delete(
                "/api/messaging/channelmember/remove/" + channelId + "/" + accountId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode", is(200)))
        .andExpect(jsonPath("$.message", is("Channel member deleted successfully")))
        .andExpect(jsonPath("$.data").doesNotExist());

    verify(directMessageChannelMemberService, times(1))
        .removeMemberFromChannel(channelId, accountId);
  }
}
