package com.sportganise.controllers.directmessaging;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.directmessaging.AddChannelMemberDto;
import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = DirectMessageChannelMemberController.class)
@AutoConfigureMockMvc(addFilters = false)
class DirectMessageChannelMemberControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private DirectMessageChannelMemberService directMessageChannelMemberService;

  @Autowired private ObjectMapper objectMapper;

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

  @Test
  public void addMembersToChannel_ShouldReturnCreatedStatus() throws Exception {
    AddChannelMemberDto addChannelMemberDto = new AddChannelMemberDto();
    addChannelMemberDto.setChannelId(1);
    addChannelMemberDto.setAdminId(100);
    addChannelMemberDto.setMemberIds(Arrays.asList(200, 201, 202));

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/messaging/channelmember/add-members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addChannelMemberDto)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.statusCode", is(201)))
        .andExpect(jsonPath("$.message", is("Members added successfully")))
        .andExpect(jsonPath("$.data").doesNotExist());

    verify(directMessageChannelMemberService, times(1))
        .saveMembers(
            addChannelMemberDto.getMemberIds(),
            addChannelMemberDto.getChannelId(),
            addChannelMemberDto.getAdminId());
  }

  @Test
  public void addMembersToChannel_WhenExceptionThrown_ShouldReturnInternalServerError()
      throws Exception {
    AddChannelMemberDto addChannelMemberDto = new AddChannelMemberDto();
    addChannelMemberDto.setChannelId(1);
    addChannelMemberDto.setAdminId(100);
    addChannelMemberDto.setMemberIds(Arrays.asList(200, 201, 202));

    doThrow(new RuntimeException("Database error"))
        .when(directMessageChannelMemberService)
        .saveMembers(
            addChannelMemberDto.getMemberIds(),
            addChannelMemberDto.getChannelId(),
            addChannelMemberDto.getAdminId());

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/messaging/channelmember/add-members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addChannelMemberDto)))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.statusCode", is(500)))
        .andExpect(
            jsonPath(
                "$.message",
                is("An unexpected error occured when trying to add members to channel.")))
        .andExpect(jsonPath("$.data").doesNotExist());

    verify(directMessageChannelMemberService, times(1))
        .saveMembers(
            addChannelMemberDto.getMemberIds(),
            addChannelMemberDto.getChannelId(),
            addChannelMemberDto.getAdminId());
  }
}
