package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller for handling HTTP requests related to Direct Message Channels. */
@RestController
@RequestMapping("/api/messaging/channel")
@Slf4j
public class DirectMessageChannelController {
  private final DirectMessageChannelService directMessageChannelService;

  /**
   * Controller Constructor.
   *
   * @param directMessageChannelService Direct Message Channel Service.
   */
  @Autowired
  public DirectMessageChannelController(DirectMessageChannelService directMessageChannelService) {
    this.directMessageChannelService = directMessageChannelService;
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
}
