package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.dto.directmessaging.SendDirectMessageResponseDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.entities.directmessaging.DirectMessageType;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.repositories.directmessaging.DirectMessageRepository;
import com.sportganise.services.BlobService;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Service class for Direct Messaging operations. */
@Slf4j
@Service
public class DirectMessageService {
  private final DirectMessageRepository directMessageRepository;
  private final DirectMessageChannelRepository directMessageChannelRepository;
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final BlobService blobService;

  /**
   * Constructor for DirectMessageService.
   *
   * @param directMessageRepository Repository for DirectMessage.
   * @param directMessageChannelRepository Repository for DirectMessageChannel.
   * @param directMessageChannelMemberRepository Repository for DirectMessageChannelMember.
   * @param blobService Service for Blob Storage operations.
   */
  public DirectMessageService(
      DirectMessageRepository directMessageRepository,
      DirectMessageChannelRepository directMessageChannelRepository,
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      BlobService blobService) {
    this.directMessageRepository = directMessageRepository;
    this.directMessageChannelRepository = directMessageChannelRepository;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.blobService = blobService;
  }

  /**
   * Sends a Direct Message in a channel and stores it in the Database while updating related
   * tables.
   *
   * @param sendDirectMessageRequestDto DTO containing the message details.
   * @return DTO containing information about the sent message.
   */
  public SendDirectMessageResponseDto sendDirectMessage(
      SendDirectMessageRequestDto sendDirectMessageRequestDto) throws IOException {
    int channelId = sendDirectMessageRequestDto.getChannelId();
    int senderId = sendDirectMessageRequestDto.getSenderId();
    DirectMessage directMessage = new DirectMessage();
    directMessage.setSenderId(senderId);
    directMessage.setChannelId(channelId);
    directMessage.setContent(sendDirectMessageRequestDto.getMessageContent());
    directMessage.setSentAt(ZonedDateTime.parse(sendDirectMessageRequestDto.getSentAt()));
    directMessage.setType(DirectMessageType.CHAT);
    directMessageRepository.save(directMessage);

    // Update Last Message in Channel Table.
    directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());

    // Update Read Status in Channel Member Table.
    directMessageChannelMemberRepository.updateReadStatus(channelId, senderId);

    SendDirectMessageResponseDto sendDirectMessageResponseDto = new SendDirectMessageResponseDto();
    sendDirectMessageResponseDto.setSenderId(senderId);
    sendDirectMessageResponseDto.setChannelId(channelId);
    sendDirectMessageResponseDto.setMessageContent(sendDirectMessageRequestDto.getMessageContent());
    sendDirectMessageResponseDto.setSentAt(sendDirectMessageRequestDto.getSentAt());
    sendDirectMessageResponseDto.setType(DirectMessageType.CHAT);

    // Upload Attachments to Blob Storage and Persist Message-Attachment relationship in DB.
    List<String> attachments = new ArrayList<>();
    for (int i = 0; i < sendDirectMessageRequestDto.getAttachments().size(); i++) {
      MultipartFile file = sendDirectMessageRequestDto.getAttachments().get(i);
      String blobUrl = blobService.uploadFile(file, true, directMessage.getMessageId().toString());
      attachments.add(blobUrl);
    }
    sendDirectMessageResponseDto.setAttachments(attachments);

    log.info("Message sent.");

    // TODO: Implement Nofication Service.

    return sendDirectMessageResponseDto;
  }

  /**
   * (WIP, next sprint) Notifies a channel that a new member has been added (acts a JOIN message).
   *
   * @param sendDirectMessageRequestDto DTO containing the channel's added member's ID in the
   *     message's content.
   * @return DTO containing the name of the newly added member to a channel.
   */
  public SendDirectMessageResponseDto addMember(
      SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    int channelId = sendDirectMessageRequestDto.getChannelId();
    int senderId = sendDirectMessageRequestDto.getSenderId();
    DirectMessage directMessage = new DirectMessage();
    directMessage.setSenderId(senderId);
    directMessage.setChannelId(channelId);
    directMessage.setContent(sendDirectMessageRequestDto.getMessageContent());
    directMessage.setSentAt(ZonedDateTime.parse(sendDirectMessageRequestDto.getSentAt()));
    directMessage.setType(DirectMessageType.JOIN);
    directMessageRepository.save(directMessage);

    // Update Last Message in Channel Table.
    directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());

    // Update Read Status in Channel Member Table.
    directMessageChannelMemberRepository.updateReadStatus(channelId, senderId);

    SendDirectMessageResponseDto sendDirectMessageResponseDto = new SendDirectMessageResponseDto();
    sendDirectMessageResponseDto.setSenderId(senderId);
    sendDirectMessageResponseDto.setChannelId(channelId);
    sendDirectMessageResponseDto.setMessageContent(sendDirectMessageRequestDto.getMessageContent());
    sendDirectMessageResponseDto.setSentAt(sendDirectMessageRequestDto.getSentAt());
    sendDirectMessageResponseDto.setType(DirectMessageType.JOIN);

    return sendDirectMessageResponseDto;
  }
}
