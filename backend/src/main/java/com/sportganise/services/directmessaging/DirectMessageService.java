package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.DirectMessageDto;
import com.sportganise.dto.directmessaging.DmAttachmentDto;
import com.sportganise.dto.directmessaging.LastMessageDto;
import com.sportganise.dto.directmessaging.MemberDetailsDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.entities.directmessaging.DirectMessageBlobType;
import com.sportganise.entities.directmessaging.DirectMessageType;
import com.sportganise.exceptions.directmessageexceptions.DirectMessageFetchException;
import com.sportganise.exceptions.directmessageexceptions.DirectMessageSendException;
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
  public List<DirectMessageDto> getChannelMessages(int channelId, ZonedDateTime lastSentAt) {
    try {
      log.info("Getting messages for channel {}", channelId);
      int messageLimit = 30;

      List<DirectMessage> messagesNoAttachments =
          directMessageRepository.getMessagesByChannelId(channelId, lastSentAt, messageLimit);
      Collections.reverse(messagesNoAttachments);
      Map<Integer, MemberDetailsDto> memberDetails = getChannelMembersDetails(channelId);
      for (Map.Entry<Integer, MemberDetailsDto> entry : memberDetails.entrySet()) {
        Integer key = entry.getKey();
        MemberDetailsDto value = entry.getValue();
        System.out.println(
            "Member Id: "
                + key
                + ", Values: "
                + value.getAvatarUrl()
                + ", "
                + value.getFirstName());
        System.out.println(memberDetails.get(key).getFirstName());
      }
      log.debug("Received member details for channel.");
      List<DirectMessageDto> messages = new ArrayList<>();
      List<DmAttachmentDto> attachments;
      DirectMessageDto messageDto;
      for (DirectMessage message : messagesNoAttachments) {
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
        Collections.reverse(attachments);
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
      log.debug("Successfully fetched messages for channel {}", channelId);
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
                      new MemberDetailsDto(
                          (String) row[2], (String) row[1]) // firstName, pictureUrl.
                  ));
    } catch (Exception e) {
      log.error("Error getting channel members details.");
      throw new DirectMessageFetchException(
          "Error occured while fetching channel members details.");
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
  public DirectMessageDto sendDirectMessage(
      SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    try {
      int channelId = sendDirectMessageRequestDto.getChannelId();
      int senderId = sendDirectMessageRequestDto.getSenderId();

      // Save DM in DB.
      int messageId = saveDirectMessage(sendDirectMessageRequestDto);

      // Update Last Message in Channel Table.
      directMessageChannelRepository.updateLastMessageId(channelId, messageId);
      log.debug("Last message updated for channel {}", channelId);

      // Update Read Status in Channel Member Table: all other members -> false, sender -> true.
      int rowsAffected =
          directMessageChannelMemberRepository.updateChannelMemberReadStatus(senderId, channelId);
      log.info("Read status updated for {} members in channel {}", rowsAffected, channelId);

      DirectMessageDto directMessageDto =
          buildDirectMessageDtoFromMessageRequest(messageId, sendDirectMessageRequestDto);

      // Set to empty list by default. Will be updated if there are attachments in a different
      // endpoint.
      directMessageDto.setAttachments(Collections.emptyList());

      return directMessageDto;
    } catch (DataAccessException e) {
      log.error("Database error occured while sending message.");
      throw new DirectMessageSendException("Database error occured while sending message.");
    } catch (Exception e) {
      log.error("Error uploading attachments.");
      throw new DirectMessageSendException(
          "An unexpected error occured when trying to send a message.");
    }
  }

  /**
   * Saves a Direct Message in the Database.
   *
   * @param sendDirectMessageRequestDto DTO containing the message details.
   * @return The ID of the saved message.
   */
  public int saveDirectMessage(SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    DirectMessage directMessage = new DirectMessage();
    directMessage.setSenderId(sendDirectMessageRequestDto.getSenderId());
    directMessage.setChannelId(sendDirectMessageRequestDto.getChannelId());
    directMessage.setContent(sendDirectMessageRequestDto.getMessageContent());
    directMessage.setSentAt(ZonedDateTime.parse(sendDirectMessageRequestDto.getSentAt()));
    directMessage.setType(DirectMessageType.valueOf(sendDirectMessageRequestDto.getType()));
    directMessageRepository.save(directMessage);

    return directMessage.getMessageId();
  }

  /**
   * Builds a DirectMessageDto from a SendDirectMessageRequestDto.
   *
   * @param messageId The ID of the message.
   * @param sendDirectMessageRequestDto DTO containing the message details.
   * @return DTO containing information about the sent message.
   */
  public DirectMessageDto buildDirectMessageDtoFromMessageRequest(
      int messageId, SendDirectMessageRequestDto sendDirectMessageRequestDto) {
    return DirectMessageDto.builder()
        .messageId(messageId)
        .senderId(sendDirectMessageRequestDto.getSenderId())
        .senderFirstName(sendDirectMessageRequestDto.getSenderFirstName())
        .channelId(sendDirectMessageRequestDto.getChannelId())
        .messageContent(sendDirectMessageRequestDto.getMessageContent())
        .sentAt(sendDirectMessageRequestDto.getSentAt())
        .type(DirectMessageType.valueOf(sendDirectMessageRequestDto.getType()))
        .avatarUrl(sendDirectMessageRequestDto.getAvatarUrl())
        .build();
  }

  /**
   * Builds a DirectMessageDto for a message with attachments.
   *
   * @param attachments List of attachment URLs.
   * @param dm The DirectMessage.
   * @param senderFirstName The first name of the sender.
   * @return DTO containing information about the sent message.
   */
  public DirectMessageDto buildDirectMessageDtoForAttachments(
      List<DmAttachmentDto> attachments,
      DirectMessage dm,
      String senderFirstName,
      String senderAvatarUrl) {
    return DirectMessageDto.builder()
        .messageId(dm.getMessageId())
        .senderId(dm.getSenderId())
        .senderFirstName(senderFirstName)
        .channelId(dm.getChannelId())
        .messageContent(dm.getContent())
        .sentAt(dm.getSentAt().toString())
        .type(dm.getType())
        .attachments(attachments)
        .avatarUrl(senderAvatarUrl)
        .build();
  }

  /**
   * Uploads attachments to Blob Storage.
   *
   * @param messageId The ID of the message.
   * @param files List of files to upload.
   * @param senderId The ID of the sender.
   * @param senderFirstName The first name of the sender.
   * @return DM DTO of the updated message with attachments.
   * @throws DirectMessageSendException If an error occurs while uploading attachments.
   */
  public DirectMessageDto uploadAttachments(
      int messageId,
      List<MultipartFile> files,
      int senderId,
      String senderFirstName,
      String senderAvatarUrl) {
    try {
      List<DmAttachmentDto> attachments = new ArrayList<>();
      log.debug("Attempting to upload {} attachments...", files.size());
      for (MultipartFile file : files) {
        String blobUrl = blobService.uploadFile(file, true, String.valueOf(messageId), senderId);
        DirectMessageBlobType fileType = getFileType(file);
        DmAttachmentDto dmAttachmentDto =
            DmAttachmentDto.builder().attachmentUrl(blobUrl).fileType(fileType).build();
        attachments.add(dmAttachmentDto);
      }
      DirectMessage dm = getDirectMessageById(messageId);
      return buildDirectMessageDtoForAttachments(attachments, dm, senderFirstName, senderAvatarUrl);
    } catch (Exception e) {
      log.error("Error uploading attachments to blob storage.");
      throw new DirectMessageSendException(
          "An unexpected error occured when trying to upload attachments.");
    }
  }

  /**
   * Gets a Direct Message by its ID.
   *
   * @param messageId The ID of the message.
   * @return The Direct Message.
   */
  public DirectMessage getDirectMessageById(int messageId) {
    return directMessageRepository.findById(messageId).orElse(null);
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
      throw new DirectMessageSendException(
          "Database error occured while sending creation message.");
    } catch (Exception e) {
      log.error("Error sending creation message.");
      throw new DirectMessageSendException(
          "An unexpected error occured when trying to send a creation message.");
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
      throw new DirectMessageFetchException(
          "An unexpected error occured when trying to fetch last message.");
    }
  }

  /**
   * Gets the last message in a channel.
   *
   * @param file The file to get the type of.
   * @return The type of the file.
   */
  public DirectMessageBlobType getFileType(MultipartFile file) {
    if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
      return DirectMessageBlobType.IMAGE;
    } else if (file.getContentType() != null && file.getContentType().startsWith("video/")) {
      return DirectMessageBlobType.VIDEO;
    } else {
      return DirectMessageBlobType.FILE;
    }
  }
}
