package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.DeleteChannelRequestDto;
import com.sportganise.dto.directmessaging.DeleteChannelRequestResponseDto;
import com.sportganise.dto.directmessaging.LastMessageDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.RenameChannelDto;
import com.sportganise.dto.directmessaging.SetDeleteApproverStatusDto;
import com.sportganise.dto.directmessaging.UpdateChannelImageResponseDto;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import com.sportganise.services.directmessaging.DirectMessageService;
import jakarta.validation.constraints.Null;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** REST Controller for handling HTTP requests related to Direct Message Channels. */
@RestController
@RequestMapping("/api/messaging/channel")
@Slf4j
public class DirectMessageChannelController {
  private final DirectMessageChannelService directMessageChannelService;
  private final DirectMessageService directMessageService;

  /**
   * Controller Constructor.
   *
   * @param directMessageChannelService Direct Message Channel Service.
   */
  @Autowired
  public DirectMessageChannelController(
      DirectMessageChannelService directMessageChannelService,
      DirectMessageService directMessageService) {
    this.directMessageChannelService = directMessageChannelService;
    this.directMessageService = directMessageService;
  }

  /**
   * Endpoint /api/messaging/create-channel: Post Mapping for Creating a new Direct Message Channel.
   *
   * @param channelDto API object for Created Channel Response.
   * @param accountId Id of the account creating the channel.
   * @return HTTP Code 201 and Created DM Channel DTO.
   */
  @PostMapping("/create-channel/{accountId}")
  public ResponseEntity<ResponseDto<CreateDirectMessageChannelDto>> createChannel(
      @RequestBody CreateDirectMessageChannelDto channelDto, @PathVariable int accountId) {
    String channelName = channelDto.getChannelName();
    List<Integer> memberIds = channelDto.getMemberIds();
    CreateDirectMessageChannelDto dmChannelDto =
        this.directMessageChannelService.createDirectMessageChannel(
            memberIds, channelName, accountId);

    if (dmChannelDto.getCreatedAt() == null) { // Channel already exists, so no timestamp created.
      ResponseDto<CreateDirectMessageChannelDto> response =
          new ResponseDto<>(
              HttpStatus.FOUND.value(), "Channel with theses members already exists", dmChannelDto);
      return new ResponseEntity<>(response, HttpStatus.FOUND);
    } else {
      ResponseDto<CreateDirectMessageChannelDto> response =
          new ResponseDto<>(
              HttpStatus.CREATED.value(), "Channel created successfully", dmChannelDto);
      return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
  }

  /**
   * Endpoint /api/messaging/get-channels/{account_id}: Get Mapping for Retrieving all Direct
   * Message.
   *
   * @param accountId Id of the account to get Direct Message Channels for.
   * @return HTTP Code 200 and List of Direct Message Channels.
   */
  @GetMapping("/get-channels/{accountId}")
  public ResponseEntity<ResponseDto<List<ListDirectMessageChannelDto>>> getChannels(
      @PathVariable int accountId) {
    List<ListDirectMessageChannelDto> channels =
        directMessageChannelService.getDirectMessageChannels(accountId);
    if (channels != null) {
      log.info("Found {} channels for account {}", channels.size(), accountId);
      log.info("Channels: {}", channels);
    }

    ResponseDto<List<ListDirectMessageChannelDto>> response =
        new ResponseDto<>(HttpStatus.OK.value(), "Channels retrieved successfully", channels);

    return ResponseEntity.ok(response);
  }

  /**
   * Endpoint /api/messaging/get-last-message/{channelId}: Get Mapping for Retrieving the last
   * message in a Direct Message Channel.
   *
   * @param channelId The ID of the channel to get the last message for.
   * @return HTTP Code 200 and Last Message DTO.
   */
  @GetMapping("/get-last-message/{channelId}")
  public ResponseEntity<ResponseDto<LastMessageDto>> getLastMessage(@PathVariable int channelId) {
    LastMessageDto lastMessage = directMessageService.getLastChannelMessage(channelId);
    if (lastMessage != null) {
      ResponseDto<LastMessageDto> response =
          new ResponseDto<>(
              HttpStatus.OK.value(), "Last message retrieved successfully", lastMessage);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } else {
      ResponseDto<LastMessageDto> response =
          new ResponseDto<>(HttpStatus.NOT_FOUND.value(), "No messages found", null);
      return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Endpoint /api/messaging/channel/rename-channel: Put Mapping for Renaming a Direct Message
   * Channel.
   *
   * @param renameChannelDto DTO object for renaming a channel.
   * @return HTTP Code 200 if successful, 404 if channel not found, 500 otherwise.
   */
  @PutMapping("/rename-channel")
  public ResponseEntity<ResponseDto<Null>> renameChannel(
      @RequestBody RenameChannelDto renameChannelDto) {
    directMessageChannelService.renameGroupChannel(
        renameChannelDto.getChannelId(), renameChannelDto.getChannelName());
    return new ResponseEntity<>(
        new ResponseDto<>(HttpStatus.OK.value(), "Channel renamed successfully", null),
        HttpStatus.OK);
  }

  /**
   * Endpoint /api/messaging/channel/update-channel-picture: Put Mapping for Updating a Direct
   * Message Channel's Picture.
   *
   * @param channelId The ID of the channel to update the picture for.
   * @param image The new image to set for the channel.
   * @param accountId The ID of the account updating the channel picture.
   * @return HTTP Code 200 if successful, 404 if channel not found, 500 otherwise.
   */
  @PostMapping(value = "/update-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ResponseDto<UpdateChannelImageResponseDto>> updateChannelPicture(
      @RequestParam("channelId") int channelId,
      @RequestParam("image") MultipartFile image,
      @RequestParam("accountId") int accountId) {
    try {
      UpdateChannelImageResponseDto responseDataDto =
          directMessageChannelService.updateChannelPicture(channelId, image, accountId);
      log.debug("New image URL: {}", responseDataDto.getChannelImageUrl());
      return new ResponseEntity<>(
          new ResponseDto<>(
              HttpStatus.OK.value(), "Channel picture updated successfully", responseDataDto),
          HttpStatus.OK);
    } catch (ChannelNotFoundException e) {
      return new ResponseEntity<>(
          new ResponseDto<>(HttpStatus.NOT_FOUND.value(), "Channel not found", null),
          HttpStatus.NOT_FOUND);
    } catch (Exception e) {
      return new ResponseEntity<>(
          new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null),
          HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint /api/messaging/delete-channel-request: Post Mapping for sending a request to delete a
   * channel. Sets other concerned members status to PENDING by default.
   *
   * @param deleteChannelRequestDto DTO object for deleting a channel.
   * @return HTTP Code 200 if successful.
   */
  @PostMapping("/delete-channel-request")
  public ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>> requestDeleteChannel(
      @RequestBody DeleteChannelRequestDto deleteChannelRequestDto) {
    log.debug("Delete channel request: {}", deleteChannelRequestDto);
    Optional<DeleteChannelRequestResponseDto> deleteReqResponse =
        directMessageChannelService.requestDeleteChannel(deleteChannelRequestDto);

    ResponseDto<DeleteChannelRequestResponseDto> responseDto;
    if (deleteReqResponse.isEmpty()) {
      responseDto = ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.NO_CONTENT.value())
              .message("The channel was immediately approved for deletion.")
              .data(null)
              .build();
      log.info("The channel was immediately approved for deletion.");
    } else {
      responseDto = ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Delete channel request sent successfully")
              .data(deleteReqResponse.get())
              .build();
      log.info("Delete channel request processed and ongoing.");
    }
    return new ResponseEntity<>(responseDto, HttpStatus.OK);
  }

  /**
   * Endpoint /api/messaging/set-delete-approver-status: Patch Mapping for setting the status of a
   * delete channel request.
   *
   * @param setApproverStatusDto DTO object for setting the status of a delete channel request.
   * @return HTTP Code 200 if successful, 204 if channel was denied deletion, 303 if channel was
   *     deleted.
   */
  @PatchMapping("/set-delete-approver-status")
  public ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>>
      setDeleteChannelApproverStatus(@RequestBody SetDeleteApproverStatusDto setApproverStatusDto) {
    log.debug(
        "Set delete approver status request ID: {}", setApproverStatusDto.getDeleteRequestId());
    log.debug("Set delete approver status to set: {}", setApproverStatusDto.getStatus());
    log.debug("Set delete approver status approver ID: {}", setApproverStatusDto.getAccountId());
    log.debug("Channel ID: {}", setApproverStatusDto.getChannelId());

    // If the status to be set is DENIED, delete the request to delete the channel.
    if (setApproverStatusDto.getStatus().equals("DENIED")) {
      this.directMessageChannelService.deleteChannelDeleteRequest(
          setApproverStatusDto.getDeleteRequestId());
      ResponseDto<DeleteChannelRequestResponseDto> responseDto =
          ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.NO_CONTENT.value())
              .data(null)
              .build();
      log.info("The request for delete was denied. Request removed.");
      return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
    DeleteChannelRequestResponseDto deleteReqResponse =
        this.directMessageChannelService.setDeleteApproverStatus(setApproverStatusDto);
    if (deleteReqResponse != null) {
      ResponseDto<DeleteChannelRequestResponseDto> responseDto =
          ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Delete channel request status updated successfully")
              .data(deleteReqResponse)
              .build();
      return new ResponseEntity<>(responseDto, HttpStatus.OK);
    } else {
      ResponseDto<DeleteChannelRequestResponseDto> responseDto =
          ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.SEE_OTHER.value())
              .data(null)
              .build();
      log.info("The request for delete was approved. Channel deleted.");
      return new ResponseEntity<>(responseDto, HttpStatus.SEE_OTHER);
    }
  }

  /**
   * Endpoint /api/messaging/delete-request-active/{channelId} Get Mapping for checking if a channel
   * has an ongoing delete request.
   *
   * @param channelId The ID of the channel to check for an active delete request.
   * @return HTTP Code 200 if successful, 204 if no active delete request found.
   */
  @GetMapping("/delete-request-active/{channelId}")
  public ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>>
      getIsChannelDeleteRequestOngoing(@PathVariable Integer channelId) {
    DeleteChannelRequestResponseDto deleteReqResponse =
        this.directMessageChannelService.getDeleteChannelRequestIsActive(channelId);
    if (deleteReqResponse == null) {
      ResponseDto<DeleteChannelRequestResponseDto> responseDto =
          ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.NO_CONTENT.value())
              .message("No active delete request found for this channel.")
              .data(null)
              .build();
      return new ResponseEntity<>(responseDto, HttpStatus.OK);
    } else {
      ResponseDto<DeleteChannelRequestResponseDto> responseDto =
          ResponseDto.<DeleteChannelRequestResponseDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Active delete request found for this channel.")
              .data(deleteReqResponse)
              .build();
      return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
  }
}
