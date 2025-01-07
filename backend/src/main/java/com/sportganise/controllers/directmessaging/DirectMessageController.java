package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.dto.directmessaging.SendDirectMessageResponseDto;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.directmessaging.DirectMessageService;
import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller for direct messaging. */
@RestController
@RequestMapping("/api/messaging/directmessage")
@Slf4j
@CrossOrigin("*")
public class DirectMessageController {

  private final DirectMessageService directMessageService;
  private final AccountRepository accountRepository;

  public DirectMessageController(
      DirectMessageService directMessageService, AccountRepository accountRepository) {
    this.directMessageService = directMessageService;
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
}
