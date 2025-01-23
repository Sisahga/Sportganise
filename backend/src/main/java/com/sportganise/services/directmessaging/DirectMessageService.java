package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.DirectMessageDto;
import com.sportganise.dto.directmessaging.LastMessageDto;
import com.sportganise.dto.directmessaging.MemberDetailsDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.entities.directmessaging.DirectMessageType;
import com.sportganise.exceptions.DirectMessageExceptions.DirectMessageFetchException;
import com.sportganise.exceptions.DirectMessageExceptions.DirectMessageSendException;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.repositories.directmessaging.DirectMessageRepository;
import com.sportganise.services.BlobService;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
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
   * Gets 30 most recent messages in a channel.
   *
   * @param channelId The ID of the channel.
   * @return List of messages in the channel in dto format.
   * @throws DirectMessageFetchException If an error occurs while fetching messages.
   */
  public List<DirectMessageDto> getChannelMessages(int channelId) {
    try {
      log.info("Getting messages for channel {}", channelId);
      List<DirectMessage> messagesNoAttachments =
              directMessageRepository.getMessagesByChannelId(channelId);
      Map<Integer, MemberDetailsDto> memberDetails = getChannelMembersDetails(channelId);
      for (Map.Entry<Integer, MemberDetailsDto> entry : memberDetails.entrySet()) {
        Integer key = entry.getKey();
        MemberDetailsDto value = entry.getValue();
        System.out.println(
                "Member Id: " + key + ", Values: " + value.getAvatarUrl() + ", " + value.getFirstName());
        System.out.println(memberDetails.get(key).getFirstName());
      }
      log.info("Received member details for channel.");
      List<DirectMessageDto> messages = new ArrayList<>();
      List<String> attachments;
      DirectMessageDto messageDto;
      for (DirectMessage message : messagesNoAttachments) {
        log.info("Sender ID: {}", message.getSenderId());
        // Case where member that sent the message isn't in the channel anymore.
        if (!memberDetails.containsKey(message.getSenderId())) {
          log.info("Sender no longer in message channel.");
          messageDto =
                  DirectMessageDto.builder()
                          .messageId(message.getMessageId())
                          .senderId(message.getSenderId())
                          .senderFirstName("Removed User")
                          .channelId(message.getChannelId())
                          .messageContent(message.getContent())
                          .attachments(Collections.emptyList())
                          .sentAt(message.getSentAt().toString())
                          .type(message.getType())
                          .avatarUrl(null)
                          .build();
          messages.add(messageDto);
          continue;
        }
        attachments = directMessageRepository.getMessageAttachments(message.getMessageId());
        messageDto =
                DirectMessageDto.builder()
                        .messageId(message.getMessageId())
                        .senderId(message.getSenderId())
                        .senderFirstName(memberDetails.get(message.getSenderId()).getFirstName())
                        .channelId(message.getChannelId())
                        .messageContent(message.getContent())
                        .attachments(attachments)
                        .sentAt(message.getSentAt().toString())
                        .type(message.getType())
                        .avatarUrl(memberDetails.get(message.getSenderId()).getAvatarUrl())
                        .build();
        messages.add(messageDto);
      }
      return messages;
    } catch (DataAccessException e) {
      log.error("Database error occured while fetching messages for channel {}", channelId);
      throw new DirectMessageFetchException("Database error occured while fetching messages.");
    } catch (Exception e) {
      log.error("Error getting messages for channel {}", channelId);
      throw new DirectMessageFetchException("Error occured while fetching messages.");
    }
  }

  /**
   * Gets profile picture and first name for all members in a channel.
   *
   * @param channelId The ID of the channel.
   * @return A Map of member IDs to their profile picture and first name.
   * @throws DirectMessageFetchException If an error occurs while fetching member details.
   */
  public Map<Integer, MemberDetailsDto> getChannelMembersDetails(int channelId) {
    try {
      log.info("Getting channel members details...");
      List<Object[]> memberDetails =
              directMessageChannelMemberRepository.getChannelMembersDetails(channelId);
      return memberDetails.stream()
              .collect(
                      Collectors.toMap(
                              row -> (Integer) row[0], // Key is the member id.
                              row ->
                                      new MemberDetailsDto((String) row[2], (String) row[1]) // firstName, pictureUrl.
                      ));
    } catch (Exception e) {
      log.error("Error getting channel members details.");
      throw new DirectMessageFetchException("Error occured while fetching channel members details.");
    }
  }

  /**
   * Sends a Direct Message in a channel and stores it in the Database while updating related
   * tables.
   *
   * @param sendDirectMessageRequestDto DTO containing the message details.
   * @return DTO containing information about the sent message.
   * @throws DirectMessageSendException If an error occurs while a message.
   */
  public DirectMessageDto sendDirectMessage(SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    try {
      int channelId = sendDirectMessageRequestDto.getChannelId();
      int senderId = sendDirectMessageRequestDto.getSenderId();
      DirectMessage directMessage = new DirectMessage();
      directMessage.setSenderId(senderId);
      directMessage.setChannelId(channelId);
      directMessage.setContent(sendDirectMessageRequestDto.getMessageContent());
      directMessage.setSentAt(ZonedDateTime.parse(sendDirectMessageRequestDto.getSentAt()));
      directMessage.setType(DirectMessageType.valueOf(sendDirectMessageRequestDto.getType()));
      directMessageRepository.save(directMessage);

      // Update Last Message in Channel Table.
      directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());
      log.debug("Last message updated for channel {}", channelId);

      // Update Read Status in Channel Member Table.
      directMessageChannelMemberRepository.updateChannelMemberReadStatus(senderId, channelId);
      log.debug("Read status updated for channel {} and member {}", channelId, senderId);

      DirectMessageDto directMessageDto = new DirectMessageDto();
      directMessageDto.setMessageId(directMessage.getMessageId());
      directMessageDto.setSenderId(senderId);
      directMessageDto.setSenderFirstName(sendDirectMessageRequestDto.getSenderFirstName());
      directMessageDto.setChannelId(channelId);
      directMessageDto.setMessageContent(sendDirectMessageRequestDto.getMessageContent());
      directMessageDto.setSentAt(sendDirectMessageRequestDto.getSentAt());
      directMessageDto.setType(DirectMessageType.valueOf(sendDirectMessageRequestDto.getType()));
      directMessageDto.setAvatarUrl(sendDirectMessageRequestDto.getAvatarUrl());

      // Upload Attachments to Blob Storage and Persist Message-Attachment relationship in DB.
      List<String> attachments = new ArrayList<>();
      for (int i = 0; i < sendDirectMessageRequestDto.getAttachments().size(); i++) {
        MultipartFile file = sendDirectMessageRequestDto.getAttachments().get(i);
        String blobUrl =
                blobService.uploadFile(file, true, directMessage.getMessageId().toString(), senderId);
        attachments.add(blobUrl);
      }
      directMessageDto.setAttachments(attachments);

      log.info("Message sent.");

      // TODO: Implement Nofication Service.

      return directMessageDto;
    } catch (DataAccessException e) {
      log.error("Database error occured while sending message.");
      throw new DirectMessageSendException("Database error occured while sending message.");
    } catch (Exception e) {
      log.error("Error uploading attachments.");
      throw new DirectMessageSendException("An unexpected error occured when trying to send a message.");
    }
  }

  /**
   * Sends a first DM of type JOIN in channel just created.
   *
   * @param channelId The ID of the channel.
   * @param creatorId The ID of the creator.
   * @param creatorFirstName The first name of the creator.
   * @throws DirectMessageSendException If an error occurs while sending a message.
   */
  public void sendCreationDirectMessage(int channelId, int creatorId, String creatorFirstName) {
    try {
      DirectMessage directMessage = new DirectMessage();
      directMessage.setSenderId(creatorId);
      directMessage.setChannelId(channelId);
      directMessage.setContent(
              "INIT*"
                      + creatorId
                      + "*You created the message channel*"
                      + creatorFirstName
                      + " created the message channel.");
      directMessage.setSentAt(ZonedDateTime.now());
      directMessage.setType(DirectMessageType.JOIN);
      directMessageRepository.save(directMessage);

      // Update Last Message in Channel Table.
      directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());
    } catch (DataAccessException e) {
      log.error("Database error occured while sending creation message.");
      throw new DirectMessageSendException("Database error occured while sending creation message.");
    } catch (Exception e) {
      log.error("Error sending creation message.");
      throw new DirectMessageSendException("An unexpected error occured when trying to send a creation message.");
    }
  }

  /**
   * (WIP, next sprint) Notifies a channel that a new member has been added (acts a JOIN message).
   *
   * @param sendDirectMessageRequestDto DTO containing the channel's added member's ID in the
   *     message's content.
   * @return DTO containing the name of the newly added member to a channel.
   */
  public DirectMessageDto addMember(SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    try {
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
      directMessageChannelMemberRepository.updateChannelMemberReadStatus(senderId, channelId);

      Map<Integer, MemberDetailsDto> memberDetails = getChannelMembersDetails(channelId);

      DirectMessageDto directMessageDto = new DirectMessageDto();
      directMessageDto.setMessageId(directMessage.getMessageId());
      directMessageDto.setSenderId(senderId);
      directMessageDto.setSenderFirstName(memberDetails.get(senderId).getFirstName());
      directMessageDto.setChannelId(channelId);
      directMessageDto.setMessageContent(sendDirectMessageRequestDto.getMessageContent());
      directMessageDto.setSentAt(sendDirectMessageRequestDto.getSentAt());
      directMessageDto.setType(DirectMessageType.JOIN);
      directMessageDto.setAvatarUrl(memberDetails.get(senderId).getAvatarUrl());

      return directMessageDto;
    } catch (DataAccessException e) {
      log.error("Database error occured while adding member.");
      throw new DirectMessageSendException("Database error occured while adding member.");
    } catch (Exception e) {
      log.error("Error adding member.");
      throw new DirectMessageSendException("An unexpected error occured when trying to add a member.");
    }
  }

  /**
   * Gets the last message in a channel.
   *
   * @param channelId The ID of the channel.
   * @return DTO containing the last message in a channel.
   */
  public LastMessageDto getLastChannelMessage(int channelId) {
    try {
      return directMessageRepository.getLastMessageByChannelId(channelId);
    } catch (Exception e) {
      log.error("Error fetching last message.");
      throw new DirectMessageFetchException("An unexpected error occured when trying to fetch last message.");
    }
  }
}
