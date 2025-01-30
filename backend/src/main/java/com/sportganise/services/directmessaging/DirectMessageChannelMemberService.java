package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.*;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberDeleteException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberFetchException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSaveException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSetRoleException;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestApproverRepository;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/** Service Class related to Direct Message Channel Members. */
@Service
@Slf4j
public class DirectMessageChannelMemberService {
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository;
  private final DeleteChannelRequestRepository deleteChannelRequestRepository;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelMemberRepository DM Channel Member Repository.
   */
  @Autowired
  public DirectMessageChannelMemberService(
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository,
      DeleteChannelRequestRepository deleteChannelRequestRepository) {
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.deleteChannelRequestApproverRepository = deleteChannelRequestApproverRepository;
    this.deleteChannelRequestRepository = deleteChannelRequestRepository;
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
   * If the user was an admin of the channel, and a delete request is ongoing, and
   * this user was the last admin needed to approve, the delete request is cancelled.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   */
  @Transactional
  public void removeMemberFromChannel(int channelId, int accountId) {
    try {
      Optional<DeleteChannelRequestApprover> dcra =
              this.deleteChannelRequestApproverRepository.approverExists(channelId, accountId);
      log.debug("Member leaving channel is approver for an ongoing delete request: {}", dcra.isPresent());
      this.directMessageChannelMemberRepository.deleteByChannelIdAndAccountId(channelId, accountId);
      log.info("Member {} removed from channel {}", accountId, channelId);

      // Check if we need to delete a delete request.
      if (dcra.isPresent()) {
        List<DeleteChannelRequestApprover> approvers =
            this.deleteChannelRequestApproverRepository
                    .findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(
                          dcra.get().getApproverCompositeKey().getDeleteRequestId());
        log.debug("Number of approvers for delete request remaining: {}", approvers.size());
        int approvedCount = 0;
        for (DeleteChannelRequestApprover approver : approvers) {
          if (approver.getStatus() == DeleteChannelRequestStatusType.PENDING) {
            return;
          } else if (approver.getStatus() == DeleteChannelRequestStatusType.APPROVED) {
            approvedCount++;
          }
        }
        // Delete request to delete channel, as admin channel member who left was last admin needed to approve.
        if (approvedCount == approvers.size()) {
          this.deleteChannelRequestRepository.deleteById(dcra.get().getApproverCompositeKey().getDeleteRequestId());
          log.info("Delete request for channel {} cancelled as last admin need to approve left channel.", channelId);
        }
      }
    } catch (DataAccessException e) {
      log.error("Database error occuring when removing member from channel: {}", e.getMessage());
      throw new ChannelMemberDeleteException(
          "Database error occured when trying to remove member from channel.");
    }
  }

  /**
   * Sets the role of a member in a channel.
   *
   * @param memberId The member id.
   * @param channelId The channel id.
   * @param role The role to set.
   */
  public void setGroupMemberRole(int memberId, int channelId, ChannelMemberRoleType role) {
    try {
      int rowsAffected =
          this.directMessageChannelMemberRepository.setChannelMemberRole(memberId, channelId, role);
      if (rowsAffected == 0) {
        log.error("Failed to set role for member.");
        throw new ChannelMemberSetRoleException("Failed to set role for member.");
      }
    } catch (DataAccessException e) {
      log.error("Database error occuring when setting role for member: {}", e.getMessage());
      throw new ChannelMemberSetRoleException(
          "Database error occured when setting role for member.");
    } catch (Exception e) {
      log.error("Unexepected error occuring when setting role for member: {}", e.getMessage());
      throw new ChannelMemberSetRoleException(
          "Unexpected error occured when setting role for member.");
    }
  }
}
