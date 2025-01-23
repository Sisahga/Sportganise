package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.DuplicateChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.UpdateChannelImageResponseDto;
import com.sportganise.entities.directmessaging.ChannelMemberRoleType;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.channelexceptions.ChannelCreationException;
import com.sportganise.exceptions.channelexceptions.ChannelDeletionException;
import com.sportganise.exceptions.channelexceptions.ChannelFetchException;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.services.BlobService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Exception;

/** Service Class related to Direct Message Channel. */
@Service
@Slf4j
public class DirectMessageChannelService {
  private final DirectMessageChannelRepository directMessageChannelRepository;
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final AccountRepository accountRepository;
  private final DirectMessageChannelMemberService directMessageChannelMemberService;
  private final DirectMessageService directMessageService;
  private final BlobService blobService;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelRepository Direct Message Channel Repository.
   * @param accountRepository Account Repository.
   * @param directMessageChannelMemberService Direct Message Channel Member Repository.
   */
  @Autowired
  public DirectMessageChannelService(
      DirectMessageChannelRepository directMessageChannelRepository,
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      AccountRepository accountRepository,
      DirectMessageChannelMemberService directMessageChannelMemberService,
      DirectMessageService directMessageService,
      BlobService blobService) {
    this.directMessageChannelRepository = directMessageChannelRepository;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.accountRepository = accountRepository;
    this.directMessageChannelMemberService = directMessageChannelMemberService;
    this.directMessageService = directMessageService;
    this.blobService = blobService;
  }

  /**
   * Creates a new DM Channel and stores it in the Database.
   *
   * @param memberIds String of member ids, separated by a ',' (min. 2 members)
   * @param channelName Name of the message channel. Can be null.
   * @param creatorAccountId Id of the account who created the channel.
   * @return DM Channel created.
   */
  @Transactional
  public CreateDirectMessageChannelDto createDirectMessageChannel(
      List<Integer> memberIds, String channelName, int creatorAccountId) {
    try {
      Collections.sort(memberIds);
      String stringRepresentation = memberIds.toString();
      String sha256hex = DigestUtils.sha256Hex(stringRepresentation);
      DuplicateChannelDto duplicateChannel =
          directMessageChannelRepository.findChannelByChannelHash(sha256hex);
      // If a channel with the same members already exists, return the existing channel.
      if (!(duplicateChannel == null)) {
        CreateDirectMessageChannelDto dmChannelDto = new CreateDirectMessageChannelDto();
        dmChannelDto.setChannelId(duplicateChannel.getChannelId());
        dmChannelDto.setChannelType(duplicateChannel.getChannelType());
        dmChannelDto.setMemberIds(memberIds);
        if (duplicateChannel.getChannelType().equals("SIMPLE")) {
          int otherMemberId =
              memberIds.get(0) == creatorAccountId ? memberIds.get(1) : memberIds.get(0);
          dmChannelDto.setChannelName(accountRepository.getFirstNameByAccountId(otherMemberId));
          dmChannelDto.setAvatarUrl(accountRepository.getPictureUrlByAccountId(otherMemberId));
        } else {
          dmChannelDto.setChannelName(duplicateChannel.getChannelName());
          dmChannelDto.setAvatarUrl(null);
        }
        return dmChannelDto;
      }

      /*
      Set the Channel Name to be the first names of members
      in the channel if it is null or empty.
      */
      if (channelName == null || channelName.isBlank() && memberIds.size() > 2) {
        StringBuilder channelNameBuilder = createChannelNameFromMembers(memberIds);
        channelName = channelNameBuilder.toString();
      }
      DirectMessageChannel dmChannel = new DirectMessageChannel();
      dmChannel.setName(channelName);
      if (memberIds.size() > 2) {
        dmChannel.setType("GROUP");
      } else {
        dmChannel.setType("SIMPLE");
      }

      ZonedDateTime timestamp = ZonedDateTime.now();
      dmChannel.setCreatedAt(timestamp);
      dmChannel.setChannelHash(sha256hex);

      DirectMessageChannel createdDmChannel = directMessageChannelRepository.save(dmChannel);
      int createdDmChannelId = createdDmChannel.getChannelId();
      // Create Channel Members
      this.directMessageChannelMemberService.saveMembers(
          memberIds, createdDmChannelId, creatorAccountId);

      // Return the DM Channel DTO
      CreateDirectMessageChannelDto dmChannelDto = new CreateDirectMessageChannelDto();
      dmChannelDto.setChannelId(createdDmChannelId);
      if (dmChannel.getType().equals("SIMPLE")) {
        int otherMemberId =
            memberIds.get(0) == creatorAccountId ? memberIds.get(1) : memberIds.get(0);
        dmChannelDto.setChannelName(accountRepository.getFirstNameByAccountId(otherMemberId));
      } else {
        dmChannelDto.setChannelName(channelName);
      }
      dmChannelDto.setChannelType(createdDmChannel.getType());
      dmChannelDto.setMemberIds(memberIds);
      dmChannelDto.setCreatedAt(timestamp.toString());
      if (dmChannel.getType().equals("SIMPLE")) {
        int otherMemberId =
            memberIds.getFirst() == creatorAccountId ? memberIds.get(1) : memberIds.get(0);
        dmChannelDto.setAvatarUrl(accountRepository.getPictureUrlByAccountId(otherMemberId));
      } else {
        dmChannelDto.setAvatarUrl(null);
      }

      String creatorFirstName = accountRepository.getFirstNameByAccountId(creatorAccountId);
      directMessageService.sendCreationDirectMessage(
          createdDmChannelId, creatorAccountId, creatorFirstName);

      // If GROUP, make creator ADMIN, rest REGULAR
      if (dmChannel.getType().equals("GROUP")) {
        initializeGroupRoles(memberIds, creatorAccountId, createdDmChannelId);
      }

      return dmChannelDto;
    } catch (DataAccessException e) {
      log.error("Database error occured while creating channel: {}", e.getMessage());
      throw new ChannelCreationException(
          "Database error occured while creating channel: " + e.getMessage());
    } catch (Exception e) {
      log.error("Failed to create direct message channel: {}", e.getMessage());
      throw new ChannelCreationException(
          "Failed to create direct message channel: " + e.getMessage());
    }
  }

  /**
   * Deletes a DM Channel and all of its channel members.
   *
   * @param channelId The ID of the channel to delete.
   * @return True if the channel was deleted successfully.
   */
  @Transactional
  public boolean deleteDirectMessageChannel(int channelId) {
    try {
      if (!directMessageChannelRepository.existsById(channelId)) {
        throw new ChannelNotFoundException("Channel not found.");
      }
      // Delete the channel.
      directMessageChannelRepository.deleteById(channelId);
      // Delete all related channel members.
      directMessageChannelMemberRepository.deleteDirectMessageChannelMemberByChannelId(channelId);
      return true;
    } catch (Exception e) {
      log.error("Failed to delete channel: {}", e.getMessage());
      throw new ChannelDeletionException("Failed to delete channel: " + e.getMessage());
    }
  }

  /**
   * Get all Direct Message Channels for an account.
   *
   * @param accountId Id of the account to get Direct Message Channels for.
   * @return List of Direct Message Channels for the account.
   */
  @Transactional
  public List<ListDirectMessageChannelDto> getDirectMessageChannels(int accountId) {
    if (!accountRepository.existsById(accountId)) {
      throw new AccountNotFoundException("Account not found.");
    }
    try {
      List<ListDirectMessageChannelDto> dmChannels =
          directMessageChannelRepository.getDirectMessageChannelsByAccountId(accountId);
      for (ListDirectMessageChannelDto dmChannel : dmChannels) {
        log.info("Channel read: {}", dmChannel.getRead());
      }
      for (ListDirectMessageChannelDto dmChannel : dmChannels) {
        // Set image blob of channel to be the image blob of the other member of the channel if it
        // is
        if (dmChannel.getChannelType().equals("SIMPLE")) {
          int otherMemberId =
              directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(
                  dmChannel.getChannelId(), accountId);
          if (otherMemberId == 0) {
            throw new ChannelMemberNotFoundException("Channel member not found.");
          }
          dmChannel.setChannelName(accountRepository.getFirstNameByAccountId(otherMemberId));
          dmChannel.setChannelImageBlob(accountRepository.getPictureUrlByAccountId(otherMemberId));
        }
      }
      return dmChannels;
    } catch (Exception e) {
      log.error("Failed to get direct message channels: {}", e.getMessage());
      throw new ChannelFetchException("Failed to get direct message channels: " + e.getMessage());
    }
  }

  /**
   * Renames a group channel.
   *
   * @param channelId The ID of the channel to rename.
   * @param channelName The new name of the channel.
   * @throws ChannelNotFoundException If the channel is not found.
   */
  public void renameGroupChannel(int channelId, String channelName)
      throws ChannelNotFoundException {
    int rowsAffected = this.directMessageChannelRepository.renameChannel(channelId, channelName);
    if (rowsAffected == 0) {
      log.error("Failed to rename channel with id: {}", channelId);
      throw new ChannelNotFoundException("Channel not found");
    } else {
      log.info("Successfully renamed channel with id: {}", channelId);
    }
  }

  /**
   * Updates the image of a channel.
   *
   * @param channelId The ID of the channel to update.
   * @param image The new image of the channel.
   * @param userId The ID of the user updating the channel.
   * @throws ChannelNotFoundException If the channel is not found.
   */
  @Transactional
  public UpdateChannelImageResponseDto updateChannelPicture(
      int channelId, MultipartFile image, Integer userId) {
    try {
      String oldImageBlobUrl =
          this.directMessageChannelRepository.getDirectMessageChannelImageBlob(channelId);
      String newImageBlobUrl = this.blobService.uploadFile(image, false, null, userId);
      UpdateChannelImageResponseDto response = new UpdateChannelImageResponseDto();
      response.setChannelImageUrl(newImageBlobUrl);

      int rowsAffected =
          this.directMessageChannelRepository.updateChannelImage(channelId, newImageBlobUrl);
      if (rowsAffected == 0) {
        log.error("Failed to update channel picture with id: {}", channelId);
        throw new ChannelNotFoundException("Channel not found.");
      }
      deleteOldImageBlob(oldImageBlobUrl);
      log.info("Successfully updated channel picture with id: {}", channelId);
      return response;
    } catch (ChannelNotFoundException e) {
      log.error(e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Failed to update channel picture: {}", e.getMessage());
      throw new FileProcessingException("Failed to update channel picture: " + e.getMessage());
    }
  }

  /**
   * Formats the channel name to be the first names of all members in the channel if no name was
   * given.
   *
   * @param memberIds String of member ids, separated by a ','
   * @return Formatted string for the channel name composed of the name of the members
   */
  private StringBuilder createChannelNameFromMembers(List<Integer> memberIds) {
    List<String> firstNames = this.accountRepository.findFirstNamesByAccountId(memberIds);

    StringBuilder channelNameBuilder = new StringBuilder();
    for (int i = 0; i < firstNames.size(); i++) {
      // Can't have channel name longer than 50 chars.
      if (i != firstNames.size() - 1
          && channelNameBuilder.length()
                  + firstNames.get(i).length()
                  + firstNames.get(i + 1).length()
              > 44) {
        channelNameBuilder.append("and ");
        channelNameBuilder.append(firstNames.get(i));
        return channelNameBuilder;
      }
      channelNameBuilder.append(firstNames.get(i));
      if (i == memberIds.size() - 2) {
        // Appends ' and ' if it's the before last element of the list.
        // Ex: "Max and James", not "Max, James".
        channelNameBuilder.append(" and ");
      } else if (i < memberIds.size() - 1) {
        channelNameBuilder.append(", ");
      }
    }
    return channelNameBuilder;
  }

  /**
   * Deletes the old image blob of a channel.
   *
   * @param oldImageBlob The URL of the old image blob.
   */
  private void deleteOldImageBlob(String oldImageBlob) {
    try {
      this.blobService.deleteFile(oldImageBlob);
      log.debug("Deleted old image blob: {}", oldImageBlob);
    } catch (S3Exception | IOException e) {
      log.warn("Failed to delete old image blob: {}", e.getMessage());
    }
  }

  /**
   * Initializes the roles of the members in a group channel.
   *
   * @param memberIds List of member ids.
   * @param creatorAccountId Id of the creator of the channel.
   * @param channelId Id of the channel.
   */
  private void initializeGroupRoles(List<Integer> memberIds, int creatorAccountId, int channelId) {
    for (int memberId : memberIds) {
      if (memberId == creatorAccountId) {
        directMessageChannelMemberService.setGroupMemberRole(
            memberId, channelId, ChannelMemberRoleType.ADMIN);
      } else {
        directMessageChannelMemberService.setGroupMemberRole(
            memberId, channelId, ChannelMemberRoleType.REGULAR);
      }
    }
  }
}
