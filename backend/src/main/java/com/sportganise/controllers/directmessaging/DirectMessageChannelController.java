package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.dto.directmessaging.SendDirectMessageResponseDto;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import com.sportganise.services.directmessaging.DirectMessageService;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller for handling HTTP requests related to Direct Message Channels. */
@RestController
@RequestMapping("/api/messaging")
@Slf4j
@CrossOrigin("*")
public class DirectMessageChannelController {
  private final DirectMessageChannelService directMessageChannelService;
  private final DirectMessageService directMessageService;
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final AccountRepository accountRepository;

  /**
   * Controller Constructor.
   *
   * @param directMessageChannelService Direct Message Channel Service.
   */
  @Autowired
  public DirectMessageChannelController(
      DirectMessageChannelService directMessageChannelService,
      DirectMessageService directMessageService,
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      AccountRepository accountRepository) {
    this.directMessageChannelService = directMessageChannelService;
    this.directMessageService = directMessageService;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.accountRepository = accountRepository;
  }

  /**
   * Send a direct message.
   *
   * @param messageDto Direct message request DTO for sending a message.
   * @return Response DTO for sending a message.
   */
  @MessageMapping("/chat.send-message")
  @SendTo("/directmessage/public")
  public SendDirectMessageResponseDto sendDirectMessage(
      @Payload SendDirectMessageRequestDto messageDto) {
    try {
      log.info("Controller received message request.");
      return directMessageService.sendDirectMessage(messageDto);
    } catch (Exception e) {
      log.error("Error sending message", e);
      return null;
    }
  }

  /**
   * Notifies a channel that a member is active in the channel.
   *
   * @param messageDto Direct message request DTO for adding a member.
   * @param headerAccessor SimpMessageHeaderAccessor for the web socket session.
   * @return Response DTO for adding a member.
   */
  // TODO (In Progress, next sprint): Create association between new member and channel in database.
  @MessageMapping("/chat.add-member")
  @SendTo("/directmessage/public")
  public SendDirectMessageResponseDto addMember(
      @Payload SendDirectMessageRequestDto messageDto, SimpMessageHeaderAccessor headerAccessor) {
    try {
      SendDirectMessageResponseDto responseDto = directMessageService.addMember(messageDto);
      // Expect content to be id of new user when adding a new user to a message channel.
      int newUserId = Integer.parseInt(messageDto.getMessageContent());
      Optional<Account> newMember = accountRepository.findById(newUserId);
      // Add username in web socket session
      newMember.ifPresent(
          account ->
              Objects.requireNonNull(headerAccessor.getSessionAttributes())
                  .put("username", account.getFirstName()));
      return responseDto;
    } catch (Exception e) {
      return null;
    }
  }

  /**
   * Endpoint /api/messaging/create-channel: Post Mapping for Creating a new Direct Message Channel.
   *
   * @param channelDto API object for Created Channel Response.
   * @param accountId Id of the account creating the channel.
   * @return HTTP Code 201 and Created DM Channel DTO.
   */
  @PostMapping("/create-channel/{accountId}")
  public ResponseEntity<CreateDirectMessageChannelDto> createChannel(
      @RequestBody CreateDirectMessageChannelDto channelDto, @PathVariable int accountId) {
    String channelName = channelDto.getChannelName();
    List<Integer> memberIds = channelDto.getMemberIds();
    CreateDirectMessageChannelDto dmChannelDto =
        this.directMessageChannelService.createDirectMessageChannel(
            memberIds, channelName, accountId);

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
    return new ResponseEntity<>(channels, HttpStatus.OK);
  }
}
