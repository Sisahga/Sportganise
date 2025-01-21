package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.*;
import com.sportganise.exceptions.ChannelNotFoundException;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import com.sportganise.services.directmessaging.DirectMessageService;
import jakarta.validation.constraints.Null;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for handling HTTP requests related to Direct Message Channels.
 */
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
   * @param accountId  Id of the account creating the channel.
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
   * Endpoint /api/messaging/delete-channel: Delete Mapping for Deleting a Direct Message Channel.
   *
   * @param id The Id of the DM Channel to delete.
   * @return HTTP Code 204 with No Content.
   */
  @DeleteMapping("/delete-channel/{id}")
  public ResponseEntity<Void> deleteChannel(@PathVariable Integer id) {
    boolean deleted = directMessageChannelService.deleteDirectMessageChannel(id);
    return deleted
            ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
  }

  /**
   * Endpoint /api/messaging/get-channels/{account_id}: Get Mapping for Retrieving all Direct
   * Message.
   *
   * @param accountId Id of the account to get Direct Message Channels for.
   * @return HTTP Code 200 and List of Direct Message Channels.
   */
  @GetMapping("/get-channels/{accountId}")
  public ResponseEntity<List<ListDirectMessageChannelDto>> getChannels(
          @PathVariable int accountId) {
    List<ListDirectMessageChannelDto> channels =
            directMessageChannelService.getDirectMessageChannels(accountId);
    if (channels != null) {
      log.info("Found {} channels for account {}", channels.size(), accountId);
      log.info("Channels: {}", channels);
    }
    return new ResponseEntity<>(channels, HttpStatus.OK);
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
    try {
      directMessageChannelService.renameGroupChannel(
              renameChannelDto.getChannelId(), renameChannelDto.getChannelName());
      return new ResponseEntity<>(
              new ResponseDto<>(HttpStatus.OK.value(), "Channel renamed successfully", null),
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
   * Endpoint /api/messaging/channel/update-channel-picture: Put Mapping for Updating a Direct
   * Message Channel's Picture.
   *
   * @param channelId The ID of the channel to update the picture for.
   * @param image     The new image to set for the channel.
   * @param accountId The ID of the account updating the channel picture.
   * @return HTTP Code 200 if successful, 404 if channel not found, 500 otherwise.
   */
  @PostMapping("/update-image")
  public ResponseEntity<ResponseDto<Null>> updateChannelPicture(
          @RequestParam("channelId") int channelId,
          @RequestParam("image") MultipartFile image,
          @RequestParam("accountId") int accountId) {
    try {
      directMessageChannelService.updateChannelPicture(channelId, image, accountId);
      return new ResponseEntity<>(
              new ResponseDto<>(HttpStatus.OK.value(), "Channel picture updated successfully", null),
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
}
