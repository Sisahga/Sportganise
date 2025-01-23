package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import com.sportganise.exceptions.channelMemberExceptions.ChannelMemberDeleteException;
import com.sportganise.exceptions.channelMemberExceptions.ChannelMemberFetchException;
import com.sportganise.exceptions.channelMemberExceptions.ChannelMemberSaveException;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/** Service Class related to Direct Message Channel Members. */
@Service
@Slf4j
public class DirectMessageChannelMemberService {
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelMemberRepository DM Channel Member Repository.
   */
  @Autowired
  public DirectMessageChannelMemberService(
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository) {
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
  }

  /**
   * Associates Account entities to a Direct Message Channel in the DB.
   *
   * @param memberIds Ids of members to link to Channel Id.
   * @param channelId Id of DM Channel.
   * @param creatorId Id of the member who created the channel.
   */
  public void saveMembers(List<Integer> memberIds, int channelId, int creatorId) {
    try {
      List<DirectMessageChannelMember> dmChannelMembers = new ArrayList<>();
      for (int memberId : memberIds) {
        DirectMessageChannelMember dmChannelMember = new DirectMessageChannelMember();
        // Create the composite key.
        DirectMessageChannelMemberCompositeKey ck = new DirectMessageChannelMemberCompositeKey();
        ck.setChannelId(channelId);
        ck.setAccountId(memberId);
        // Set the composite key as the id of the dmChannelMember
        dmChannelMember.setCompositeKey(ck);
        dmChannelMember.setRead(memberId == creatorId);
        dmChannelMembers.add(dmChannelMember);
      }
      this.directMessageChannelMemberRepository.saveAll(dmChannelMembers);
    } catch (DataAccessException e) {
      log.error("Database error occuring when saving members to channel: {}", e.getMessage());
      throw new ChannelMemberSaveException("Failed to save members to channel.");
    }
  }

  /**
   * Marks a channel as read for a specific account.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return The number of rows affected.
   */
  public int markChannelAsRead(int channelId, int accountId) {
    try {
      return this.directMessageChannelMemberRepository.updateChannelMemberReadStatus(
          accountId, channelId);
    } catch (DataAccessException e) {
      log.error("Database error occuring when marking channel as read: {}", e.getMessage());
      throw new ChannelMemberSaveException("Failed to mark channel as read.");
    }
  }

  /**
   * Gets all members of a channel besides the user.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return A list of ChannelMembersDto.
   */
  public List<ChannelMembersDto> getNonUserChannelMembers(int channelId, int accountId) {
    try {
      return this.directMessageChannelMemberRepository.getNonUserChannelMembers(
          channelId, accountId);
    } catch (DataAccessException e) {
      log.error(
          "Database error occuring when fetching non user channel members: {}", e.getMessage());
      throw new ChannelMemberFetchException(
          "Database error occured when fetching non user channel members.");
    }
  }

  /**
   * Gets all members of a channel.
   *
   * @param channelId The channel id.
   * @return A list of ChannelMembersDto.
   */
  public List<ChannelMembersDto> getAllChannelMembers(int channelId) {
    try {
      return this.directMessageChannelMemberRepository.getAllChannelMembers(channelId);
    } catch (DataAccessException e) {
      log.error("Database error occuring when fetching all channel members: {}", e.getMessage());
      throw new ChannelMemberFetchException(
          "Database error occured when fetching all channel members.");
    }
  }

  /**
   * Removes a user from a channel.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   */
  public void removeMemberFromChannel(int channelId, int accountId) {
    try {
      this.directMessageChannelMemberRepository.deleteByChannelIdAndAccountId(channelId, accountId);
    } catch (DataAccessException e) {
      log.error("Database error occuring when removing member from channel: {}", e.getMessage());
      throw new ChannelMemberDeleteException(
          "Database error occured when trying to remove member from channel.");
    }
  }
}
