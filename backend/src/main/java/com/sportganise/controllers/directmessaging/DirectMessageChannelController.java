package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** REST Controller for handling HTTP requests related to Direct Message Channels. */
@RestController
@RequestMapping("/api/messaging")
@CrossOrigin("*")
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
   * @return HTTP Code 201 and Created DM Channel DTO.
   */
  @PostMapping("/create-channel")
  public ResponseEntity<CreateDirectMessageChannelDto> createChannel(
      @RequestBody CreateDirectMessageChannelDto channelDto) {
    String channelName = channelDto.getChannelName();
    List<Integer> memberIds = channelDto.getMemberIds();
    CreateDirectMessageChannelDto dmChannelDto =
        this.directMessageChannelService.createDirectMessageChannel(memberIds, channelName);

    return new ResponseEntity<>(dmChannelDto, HttpStatus.CREATED);
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
}
