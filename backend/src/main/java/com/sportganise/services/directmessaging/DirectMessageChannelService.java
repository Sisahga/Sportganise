package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.DuplicateChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.exceptions.ChannelNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service Class related to Direct Message Channel. */
@Service
@Slf4j
public class DirectMessageChannelService {
  private final DirectMessageChannelRepository directMessageChannelRepository;
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final AccountRepository accountRepository;
  private final DirectMessageChannelMemberService directMessageChannelMemberService;
  private final DirectMessageService directMessageService;

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
      DirectMessageService directMessageService) {
    this.directMessageChannelRepository = directMessageChannelRepository;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.accountRepository = accountRepository;
    this.directMessageChannelMemberService = directMessageChannelMemberService;
    this.directMessageService = directMessageService;
  }

  /**
   * Creates a new DM Channel and stores it in the Database.
   *
   * @param memberIds String of member ids, separated by a ',' (min. 2 members)
   * @param channelName Name of the message channel. Can be null.
   * @param creatorAccountId Id of the account who created the channel.
   * @return DM Channel created.
   */
  public CreateDirectMessageChannelDto createDirectMessageChannel(
      List<Integer> memberIds, String channelName, int creatorAccountId) {
    Collections.sort(memberIds);
    String stringRepresentation = memberIds.toString();
    String sha256hex = DigestUtils.sha256Hex(stringRepresentation);
    DuplicateChannelDto duplicateChannel =
        directMessageChannelRepository.findChannelByChannelHash(sha256hex);
    if (!(duplicateChannel == null)) {
      log.info("DUPLICATE CHANNEL HANDLED.");
      CreateDirectMessageChannelDto dmChannelDto = new CreateDirectMessageChannelDto();
      dmChannelDto.setChannelId(duplicateChannel.getChannelId());
      dmChannelDto.setChannelType(duplicateChannel.getChannelType());
      dmChannelDto.setMemberIds(memberIds);
      if (duplicateChannel.getChannelType().equals("SIMPLE")) {
        int otherMemberId =
            directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(
                duplicateChannel.getChannelId(), creatorAccountId);
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
    return dmChannelDto;
  }

  /**
   * Deletes a DM Channel and all of its channel members.
   *
   * @param channelId The ID of the channel to delete.
   */
  public boolean deleteDirectMessageChannel(int channelId) {
    if (directMessageChannelRepository.existsById(channelId)) {
      // Delete the channel.
      directMessageChannelRepository.deleteById(channelId);
      // Delete all related channel members.
      directMessageChannelMemberRepository.deleteDirectMessageChannelMemberByChannelId(channelId);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get all Direct Message Channels for an account.
   *
   * @param accountId Id of the account to get Direct Message Channels for.
   * @return List of Direct Message Channels for the account.
   */
  public List<ListDirectMessageChannelDto> getDirectMessageChannels(int accountId) {
    List<ListDirectMessageChannelDto> dmChannels =
        directMessageChannelRepository.getDirectMessageChannelsByAccountId(accountId);
    for (ListDirectMessageChannelDto dmChannel : dmChannels) {
      log.info("Channel read: {}", dmChannel.getRead());
    }
    for (ListDirectMessageChannelDto dmChannel : dmChannels) {
      // Set image blob of channel to be the image blob of the other member of the channel if it is
      if (dmChannel.getChannelType().equals("SIMPLE")) {
        int otherMemberId =
            directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(
                dmChannel.getChannelId(), accountId);
        log.info("Other member id: {}", otherMemberId);
        dmChannel.setChannelName(accountRepository.getFirstNameByAccountId(otherMemberId));
        dmChannel.setChannelImageBlob(accountRepository.getPictureUrlByAccountId(otherMemberId));
      }
    }
    return dmChannels;
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
}
