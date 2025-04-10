package com.sportganise.controllers.directmessaging;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.RenameChannelDto;
import com.sportganise.dto.directmessaging.UpdateChannelImageResponseDto;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import com.sportganise.services.directmessaging.DirectMessageService;
import jakarta.validation.constraints.Null;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = DirectMessageChannelController.class)
@AutoConfigureMockMvc(addFilters = false)
class DirectMessageChannelControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @InjectMocks private DirectMessageChannelController directMessageChannelController;
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
  public void createDirectMessageChannelTest_NewChannel() throws Exception {
    // Set createdAt to simulate a new channel
    createDmChannelDTO.setCreatedAt(String.valueOf(ZonedDateTime.now()));

    ResponseDto<CreateDirectMessageChannelDto> responseDto =
        new ResponseDto<>(201, "Channel created successfully", createDmChannelDTO);

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
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data.channelName", is(createDmChannelDTO.getChannelName())))
        .andExpect(jsonPath("$.data.channelType", is(createDmChannelDTO.getChannelType())))
        .andExpect(jsonPath("$.data.memberIds", is(createDmChannelDTO.getMemberIds())))
        .andExpect(jsonPath("$.data.memberIds.length()").value(2))
        .andReturn();

    verify(dmChannelService, times(1))
        .createDirectMessageChannel(
            createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName(), 1);
  }

  @Test
  public void createDirectMessageChannelTest_ExistingChannel() throws Exception {
    // Set createdAt to null to simulate an existing channel
    createDmChannelDTO.setCreatedAt(null);

    ResponseDto<CreateDirectMessageChannelDto> responseDto =
        new ResponseDto<>(302, "Channel with theses members already exists", createDmChannelDTO);

    given(
            dmChannelService.createDirectMessageChannel(
                createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName(), 1))
        .willReturn(createDmChannelDTO);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/messaging/channel/create-channel/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(createDmChannelDTO)))
        .andExpect(status().isFound())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data.channelName", is(createDmChannelDTO.getChannelName())))
        .andExpect(jsonPath("$.data.channelType", is(createDmChannelDTO.getChannelType())))
        .andExpect(jsonPath("$.data.memberIds", is(createDmChannelDTO.getMemberIds())))
        .andExpect(jsonPath("$.data.memberIds.length()").value(2))
        .andReturn();

    verify(dmChannelService, times(1))
        .createDirectMessageChannel(
            createDmChannelDTO.getMemberIds(), createDmChannelDTO.getChannelName(), 1);
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
        .andExpect(jsonPath("$.data[0].channelId", is(channel1.getChannelId())))
        .andExpect(jsonPath("$.data[0].channelType", is(channel1.getChannelType())))
        .andExpect(jsonPath("$.data[0].channelName", is(channel1.getChannelName())))
        .andExpect(jsonPath("$.data[0].channelImageBlob", is(channel1.getChannelImageBlob())))
        .andExpect(jsonPath("$.data[0].lastMessage", is(channel1.getLastMessage())))
        .andExpect(jsonPath("$.data[0].read", is(channel1.getRead())))
        .andExpect(jsonPath("$.data[1].channelId", is(channel2.getChannelId())))
        .andExpect(jsonPath("$.data[1].channelType", is(channel2.getChannelType())))
        .andExpect(jsonPath("$.data[1].channelName", is(channel2.getChannelName())))
        .andExpect(jsonPath("$.data[1].channelImageBlob", is(channel2.getChannelImageBlob())))
        .andExpect(jsonPath("$.data[1].lastMessage", is(channel2.getLastMessage())))
        .andExpect(jsonPath("$.data[1].read", is(channel2.getRead())));
    verify(dmChannelService, times(1)).getDirectMessageChannels(accountId);
  }

  @Test
  public void getDirectMessageChannelsTest_NoChannels() throws Exception {
    int accountId = 1;
    given(dmChannelService.getDirectMessageChannels(accountId)).willReturn(null);
    mockMvc
        .perform(MockMvcRequestBuilders.get("/api/messaging/channel/get-channels/" + accountId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Channels retrieved successfully"))
        .andExpect(jsonPath("$.data").doesNotExist());
    verify(dmChannelService, times(1)).getDirectMessageChannels(accountId);
  }

  @Test
  public void renameChannel_Success() throws Exception {
    RenameChannelDto renameChannelDto = new RenameChannelDto();
    renameChannelDto.setChannelId(1);
    renameChannelDto.setChannelName("New Channel Name");

    ResponseDto<Null> responseDto = new ResponseDto<>(200, "Channel renamed successfully", null);

    doNothing()
        .when(dmChannelService)
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());

    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/api/messaging/channel/rename-channel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(renameChannelDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data", nullValue()));

    verify(dmChannelService, times(1))
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());
  }

  @Test
  public void renameChannel_NotFound() throws Exception {
    RenameChannelDto renameChannelDto = new RenameChannelDto();
    renameChannelDto.setChannelId(1);
    renameChannelDto.setChannelName("New Channel Name");

    ResponseDto<Null> responseDto = new ResponseDto<>(404, "Channel not found", null);

    doThrow(new ChannelNotFoundException("Channel not found"))
        .when(dmChannelService)
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());

    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/api/messaging/channel/rename-channel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(renameChannelDto)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data", nullValue()));

    verify(dmChannelService, times(1))
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());
  }

  @Test
  public void renameChannel_InternalServerError() throws Exception {
    RenameChannelDto renameChannelDto = new RenameChannelDto();
    renameChannelDto.setChannelId(1);
    renameChannelDto.setChannelName("New Channel Name");

    ResponseDto<Null> responseDto = new ResponseDto<>(500, "Unexpected error", null);

    doThrow(new RuntimeException("Unexpected error"))
        .when(dmChannelService)
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());

    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/api/messaging/channel/rename-channel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(renameChannelDto)))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data", nullValue()));

    verify(dmChannelService, times(1))
        .renameGroupChannel(renameChannelDto.getChannelId(), renameChannelDto.getChannelName());
  }

  @Test
  public void updateChannelPicture_Success() throws Exception {
    int channelId = 1;
    int accountId = 1;
    MockMultipartFile image =
        new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.MULTIPART_FORM_DATA_VALUE,
            "test image content".getBytes());

    UpdateChannelImageResponseDto responseDataDto =
        new UpdateChannelImageResponseDto("https://example.com/image.jpg");
    ResponseDto<UpdateChannelImageResponseDto> responseDto =
        new ResponseDto<>(200, "Channel picture updated successfully", responseDataDto);

    when(dmChannelService.updateChannelPicture(channelId, image, accountId))
        .thenReturn(responseDataDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/messaging/channel/update-image")
                .file(image)
                .param("channelId", String.valueOf(channelId))
                .param("accountId", String.valueOf(accountId)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data.channelImageUrl", is(responseDataDto.getChannelImageUrl())));

    verify(dmChannelService, times(1)).updateChannelPicture(channelId, image, accountId);
  }

  @Test
  public void updateChannelPicture_ChannelNotFound() throws Exception {
    int channelId = 1;
    int accountId = 1;
    MockMultipartFile image =
        new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.MULTIPART_FORM_DATA_VALUE,
            "test image content".getBytes());

    ResponseDto<Void> responseDto = new ResponseDto<>(404, "Channel not found", null);

    doThrow(new ChannelNotFoundException("Channel not found"))
        .when(dmChannelService)
        .updateChannelPicture(channelId, image, accountId);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/messaging/channel/update-image")
                .file(image)
                .param("channelId", String.valueOf(channelId))
                .param("accountId", String.valueOf(accountId)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data", nullValue()));

    verify(dmChannelService, times(1)).updateChannelPicture(channelId, image, accountId);
  }

  @Test
  public void updateChannelPicture_InternalServerError() throws Exception {
    int channelId = 1;
    int accountId = 1;
    MockMultipartFile image =
        new MockMultipartFile(
            "image", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes());

    String errorMessage = "Unexpected error";
    ResponseDto<Void> responseDto = new ResponseDto<>(500, errorMessage, null);

    doThrow(new RuntimeException(errorMessage))
        .when(dmChannelService)
        .updateChannelPicture(channelId, image, accountId);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/messaging/channel/update-image")
                .file(image)
                .param("channelId", String.valueOf(channelId))
                .param("accountId", String.valueOf(accountId)))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.statusCode", is(responseDto.getStatusCode())))
        .andExpect(jsonPath("$.message", is(responseDto.getMessage())))
        .andExpect(jsonPath("$.data", nullValue()));

    verify(dmChannelService, times(1)).updateChannelPicture(channelId, image, accountId);
  }
}
