package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.DirectMessageDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.services.directmessaging.DirectMessageService;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Controller for direct messaging. */
@RestController
@RequestMapping("/api/messaging/directmessage")
@Slf4j
public class DirectMessageController {

  private final DirectMessageService directMessageService;
  private final SimpMessagingTemplate simpMessagingTemplate;

  public DirectMessageController(
      DirectMessageService directMessageService, SimpMessagingTemplate simpMessagingTemplate) {
    this.directMessageService = directMessageService;
    this.simpMessagingTemplate = simpMessagingTemplate;
  }

  /**
   * Gets messages dynamically in a message channel in chunks of 30. Starts with 30 most recent
   * messages. API Endpoint (null lastSentAt): GET
   * /api/messaging/directmessage/get-messages/{channelId} API Endpoint (with lastSentAt): GET
   * /api/messaging/directmessage/get-messages/{channelId}?lastSentAt={lastSentAt}
   *
   * @param channelId The ID of the channel.
   * @return List of messages in the channel with status 200.
   */
  @GetMapping("/get-messages/{channelId}")
  public ResponseEntity<List<DirectMessageDto>> getChannelMessages(
      @PathVariable int channelId, @RequestParam(required = false) String lastSentAt) {
    ZonedDateTime lastSentAtDateTime = null;
    if (lastSentAt != null && !lastSentAt.isEmpty()) {
      lastSentAtDateTime = ZonedDateTime.parse(lastSentAt);
    }

    return new ResponseEntity<>(
        directMessageService.getChannelMessages(channelId, lastSentAtDateTime), HttpStatus.OK);
  }

  /**
   * Send a direct message in real-time.
   *
   * @param messageDto Direct message request DTO for sending a message.
   */
  @MessageMapping("/chat.send-message")
  public DirectMessageDto sendDirectMessage(@Payload SendDirectMessageRequestDto messageDto) {
    try {
      log.info("Controller received message request.");
      DirectMessageDto message = directMessageService.sendDirectMessage(messageDto);
      log.debug("Message sent with id {}!", message.getMessageId());
      simpMessagingTemplate.convertAndSend("/directmessage/" + messageDto.getChannelId(), message);
      return message;
    } catch (Exception e) {
      log.error("Error sending message", e);
      return null;
    }
  }

  /**
   * Upload attachments to a message.
   *
   * @param attachments List of attachments to upload.
   * @param channelId ID of the channel to upload attachments to.
   * @param messageId ID of the message to upload attachments to.
   * @param senderId ID of the sender.
   * @param senderFirstName First name of the sender.
   * @param senderAvatarUrl URL of the sender's avatar.
   * @return Response DTO with the update message with attachments.
   */
  @PostMapping(value = "/upload-attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ResponseDto<DirectMessageDto>> uploadAttachments(
      @RequestParam("attachments") List<MultipartFile> attachments,
      @RequestParam("channelId") int channelId,
      @RequestParam("messageId") int messageId,
      @RequestParam("senderId") int senderId,
      @RequestParam("senderFirstName") String senderFirstName,
      @RequestParam("senderAvatarUrl") String senderAvatarUrl) {
    try {
      log.info("Controller received attachment upload request.");
      log.debug("Attachments to upload: {}", attachments.size());
      DirectMessageDto updatedMessage =
          directMessageService.uploadAttachments(
              messageId, attachments, senderId, senderFirstName, senderAvatarUrl);
      simpMessagingTemplate.convertAndSend("/directmessage/" + channelId, updatedMessage);
      ResponseDto<DirectMessageDto> response =
          ResponseDto.<DirectMessageDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Attachments uploaded successfully.")
              .data(updatedMessage)
              .build();
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error uploading attachments", e);
      return null;
    }
  }
}
