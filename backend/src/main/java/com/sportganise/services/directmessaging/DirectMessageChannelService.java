package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.DeleteChannelRequestDto;
import com.sportganise.dto.directmessaging.DeleteChannelRequestMembersDto;
import com.sportganise.dto.directmessaging.DeleteChannelRequestResponseDto;
import com.sportganise.dto.directmessaging.DuplicateChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.SetDeleteApproverStatusDto;
import com.sportganise.dto.directmessaging.UpdateChannelImageResponseDto;
import com.sportganise.entities.directmessaging.ChannelMemberRoleType;
import com.sportganise.entities.directmessaging.DeleteChannelRequest;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApprover;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApproverCompositeKey;
import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.channelexceptions.ChannelCreationException;
import com.sportganise.exceptions.channelexceptions.ChannelDeletionException;
import com.sportganise.exceptions.channelexceptions.ChannelFetchException;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberNotFoundException;
import com.sportganise.exceptions.deletechannelrequestexceptions.DeleteChannelApproverException;
import com.sportganise.exceptions.deletechannelrequestexceptions.DeleteChannelRequestException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestApproverRepository;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.services.BlobService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
  private final DeleteChannelRequestRepository deleteChannelRequestRepository;
  private final DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelRepository Direct Message Channel Repository.
   * @param accountRepository Account Repository.
   * @param directMessageChannelMemberService Direct Message Channel Member Repository.
   * @param directMessageService Direct Message Service.
   * @param blobService Blob Service.
   * @param deleteChannelRequestRepository Delete Channel Request Repository.
   * @param deleteChannelRequestApproverRepository Delete Channel Request Approver Repository.
   */
  @Autowired
  public DirectMessageChannelService(
      DirectMessageChannelRepository directMessageChannelRepository,
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      AccountRepository accountRepository,
      DirectMessageChannelMemberService directMessageChannelMemberService,
      DirectMessageService directMessageService,
      BlobService blobService,
      DeleteChannelRequestRepository deleteChannelRequestRepository,
      DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository) {
    this.directMessageChannelRepository = directMessageChannelRepository;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.accountRepository = accountRepository;
    this.directMessageChannelMemberService = directMessageChannelMemberService;
    this.directMessageService = directMessageService;
    this.blobService = blobService;
    this.deleteChannelRequestRepository = deleteChannelRequestRepository;
    this.deleteChannelRequestApproverRepository = deleteChannelRequestApproverRepository;
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
      log.info("Channel created with ID {}", createdDmChannel.getChannelId());
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
   * Deletes a DM Channel, all of its channel members, and all of its contents.
   *
   * @param channelId The ID of the channel to delete.
   */
  public void deleteDirectMessageChannel(int channelId) {
    try {
      if (!directMessageChannelRepository.existsById(channelId)) {
        throw new ChannelNotFoundException("Channel not found.");
      }
      // Delete the channel, all of its members, and message with ON DELETE CASCADE in schema.
      directMessageChannelRepository.deleteById(channelId);
    } catch (ChannelNotFoundException e) {
      log.error("Channel not found when trying to delete channel.");
      throw e;
    } catch (DataAccessException e) {
      log.error("Database error occured while deleting channel: {}", e.getMessage());
      throw new ChannelDeletionException(
          "Database error occured while deleting channel: " + e.getMessage());
    } catch (Exception e) {
      log.error("Failed to delete channel: {}", e.getMessage());
      throw new ChannelDeletionException(
          "Unexpected error when deleting channel: " + e.getMessage());
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
        // Set image blob of channel to be image blob of other member of the channel if it is
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
    } catch (AccountNotFoundException e) {
      log.error(e.getMessage());
      throw e;
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
   * Requests to delete a channel.
   *
   * @param deleteChannelRequestDto The request to delete a channel.
   * @return The response to the delete channel request.
   */
  @Transactional
  public Optional<DeleteChannelRequestResponseDto> requestDeleteChannel(
      DeleteChannelRequestDto deleteChannelRequestDto) {
    try {
      if (!directMessageChannelRepository.existsById(deleteChannelRequestDto.getChannelId())) {
        throw new ChannelNotFoundException("Channel not found.");
      }

      // Check if GROUP & the requester is the only admin channel member, if so delete immediately.
      if (deleteChannelRequestDto.getChannelType().equals("GROUP")) {
        boolean existsOtherAdmins =
            existsOtherAdminChannelMember(
                deleteChannelRequestDto.getChannelId(), deleteChannelRequestDto.getCreatorId());
        if (!existsOtherAdmins) {
          log.info(
              "Requester is the only admin channel member. Deleting channel {}...",
              deleteChannelRequestDto.getChannelId());
          deleteDirectMessageChannel(deleteChannelRequestDto.getChannelId());
          return Optional.empty();
        }
      }

      log.debug("Requesting to deleting channel: {}", deleteChannelRequestDto.getChannelId());
      // Save the delete channel request.
      DeleteChannelRequest deleteChannelRequest =
          DeleteChannelRequest.builder()
              .channelId(deleteChannelRequestDto.getChannelId())
              .requesterId(deleteChannelRequestDto.getCreatorId())
              .requestDate(ZonedDateTime.now())
              .build();
      final DeleteChannelRequest newDeleteReq =
          this.deleteChannelRequestRepository.save(deleteChannelRequest);

      log.debug("creatming channel request: {}", deleteChannelRequestDto.getChannelId());

      int newDeleteRequestId = newDeleteReq.getDeleteRequestId();

      // Save all authorized members (DeleteChannelRequestApprover relationship).
      log.debug("newDeleteReqID: {}", newDeleteRequestId);
      saveAuthorizedMembersToDeleteChannelRequest(
          deleteChannelRequestDto.getChannelId(),
          deleteChannelRequestDto.getChannelType(),
          deleteChannelRequestDto.getCreatorId(),
          newDeleteRequestId);
      log.debug("newDeleteReqID: {}", newDeleteRequestId);
      String channelType = deleteChannelRequestDto.getChannelType();
      if (!channelType.equals("SIMPLE") && !channelType.equals("GROUP")) {
        throw new IllegalArgumentException("Invalid channel type.");
      }

      log.debug("Delete REQUEST ID: {}", newDeleteRequestId);

      // Create the first part of the response dto (The delete request dto).
      DeleteChannelRequestDto delReqResponse =
          DeleteChannelRequestDto.builder()
              .deleteRequestId(newDeleteRequestId)
              .channelId(newDeleteReq.getChannelId())
              .creatorId(newDeleteReq.getRequesterId())
              .channelType(channelType)
              .creatorName(accountRepository.getFirstNameByAccountId(newDeleteReq.getRequesterId()))
              .build();

      // Create the second part of the response dto (ChannelMembersDto).
      List<DeleteChannelRequestMembersDto> dcrMembersDto =
          this.deleteChannelRequestApproverRepository.getChannelMembersDetailsForDeleteRequest(
              newDeleteRequestId);
      return Optional.of(new DeleteChannelRequestResponseDto(delReqResponse, dcrMembersDto));
    } catch (DataAccessException e) {
      log.error("Database error occured while requesting to delete channel: {}", e.getMessage());
      throw new ChannelDeletionException(
          "Database error occured while requesting to delete channel: " + e.getMessage());
    }
  }

  /**
   * Sets the status of a delete approver.
   *
   * @param setDeleteApproverStatusDto The request to set the status of a delete approver.
   * @return The response to the set delete approver status request.
   */
  @Transactional
  public DeleteChannelRequestResponseDto setDeleteApproverStatus(
      SetDeleteApproverStatusDto setDeleteApproverStatusDto) {
    try {
      log.debug("Approver ID before key: {}", setDeleteApproverStatusDto.getAccountId());
      log.debug(
          "Delete Request ID before key: {}", setDeleteApproverStatusDto.getDeleteRequestId());
      DeleteChannelRequestApprover approver =
          this.deleteChannelRequestApproverRepository
              .findByKey(
                  setDeleteApproverStatusDto.getDeleteRequestId(),
                  setDeleteApproverStatusDto.getAccountId())
              .orElse(null);

      log.info("Approver found: {}", approver);

      if (approver == null) {
        throw new DeleteChannelApproverException(
            "Approver not found when trying to set their status.");
      }
      DeleteChannelRequestStatusType status =
          DeleteChannelRequestStatusType.valueOf(setDeleteApproverStatusDto.getStatus());
      approver.setStatus(status);
      this.deleteChannelRequestApproverRepository.save(approver);

      boolean channelDeleted =
          checkDeleteRequestApprovalStatus(
              setDeleteApproverStatusDto.getDeleteRequestId(),
              setDeleteApproverStatusDto.getChannelId());

      if (channelDeleted) {
        log.info("Channel {} deleted.", setDeleteApproverStatusDto.getChannelId());
        return null;
      } else {
        log.debug(
            "Channel {} closer to being approved.", setDeleteApproverStatusDto.getChannelId());
        DirectMessageChannel channel =
            this.directMessageChannelRepository
                .findById(setDeleteApproverStatusDto.getChannelId())
                .orElseThrow(() -> new ChannelNotFoundException("Channel not found."));
        log.debug("Channel found for delete request: {}", channel.getChannelId());
        String channelType = channel.getType();
        DeleteChannelRequestDto deleteChannelRequestDto =
            DeleteChannelRequestDto.builder()
                .deleteRequestId(setDeleteApproverStatusDto.getDeleteRequestId())
                .channelId(setDeleteApproverStatusDto.getChannelId())
                .creatorId(setDeleteApproverStatusDto.getAccountId())
                .channelType(channelType)
                .creatorName(
                    accountRepository.getFirstNameByAccountId(
                        setDeleteApproverStatusDto.getAccountId()))
                .build();
        List<DeleteChannelRequestMembersDto> dcrMembersDto =
            this.deleteChannelRequestApproverRepository.getChannelMembersDetailsForDeleteRequest(
                setDeleteApproverStatusDto.getDeleteRequestId());
        return new DeleteChannelRequestResponseDto(deleteChannelRequestDto, dcrMembersDto);
      }
    } catch (DataAccessException e) {
      log.error("Database error occured while setting delete approver status: {}", e.getMessage());
      throw new DeleteChannelApproverException(
          "Database error occured while setting delete approver status: " + e.getMessage());
    }
  }

  /**
   * Deletes a delete request.
   *
   * @param deleteRequestId The ID of the delete request to delete.
   */
  public void deleteChannelDeleteRequest(int deleteRequestId) {
    try {
      this.deleteChannelRequestRepository.deleteById(deleteRequestId);
    } catch (DataAccessException e) {
      log.error("Database error occured while deleting delete request: {}", e.getMessage());
      throw new DeleteChannelRequestException(
          "Database error occured while deleting delete request: " + e.getMessage());
    }
  }

  /**
   * Checks if a channel has an ongoing delete channel request. If so, returns the delete channel
   * request and the authorized members' status'.
   *
   * @param channelId The ID of the channel to check for a delete channel request.
   * @return Null, or the delete channel request and the authorized members' status'.
   */
  public DeleteChannelRequestResponseDto getDeleteChannelRequestIsActive(int channelId) {
    try {
      Optional<DeleteChannelRequest> deleteChannelRequest =
          this.deleteChannelRequestRepository.findByChannelId(channelId);
      if (deleteChannelRequest.isEmpty()) {
        log.info("No delete channel request found for channel ID: {}", channelId);
        return null;
      } else {
        log.debug(
            "Delete Channel Request ID found: {}", deleteChannelRequest.get().getDeleteRequestId());
        String channelType = this.directMessageChannelRepository.findTypeByChannelId(channelId);
        DeleteChannelRequestDto deleteChannelRequestDto =
            DeleteChannelRequestDto.builder()
                .deleteRequestId(deleteChannelRequest.get().getDeleteRequestId())
                .channelId(deleteChannelRequest.get().getChannelId())
                .creatorId(deleteChannelRequest.get().getRequesterId())
                .channelType(channelType)
                .creatorName(
                    accountRepository.getFirstNameByAccountId(
                        deleteChannelRequest.get().getRequesterId()))
                .build();
        List<DeleteChannelRequestMembersDto> dcrMembersDto =
            this.deleteChannelRequestApproverRepository.getChannelMembersDetailsForDeleteRequest(
                deleteChannelRequest.get().getDeleteRequestId());
        return new DeleteChannelRequestResponseDto(deleteChannelRequestDto, dcrMembersDto);
      }
    } catch (DataAccessException e) {
      log.error("Database error occured while getting delete channel request: {}", e.getMessage());
      throw new DeleteChannelRequestException(
          "Database error occured while getting delete channel request: " + e.getMessage());
    } catch (Exception e) {
      log.error(
          "An unexpected error occured while getting delete channel request: {}", e.getMessage());
      throw new DeleteChannelRequestException(
          "An unexpected error occured trying to get delete channel request: " + e.getMessage());
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

  /**
   * Saves the authorized members to delete a channel request. The creator of the channel is
   * automatically approved.
   *
   * @param channelId The ID of the channel to delete.
   * @param channelType The type of the channel.
   * @param creatorId The ID of the creator of the channel.
   * @param deleteChannelRequestId The ID of the delete channel request.
   */
  public void saveAuthorizedMembersToDeleteChannelRequest(
      int channelId, String channelType, int creatorId, int deleteChannelRequestId) {
    log.debug("Saving authorized members to delete channel request id: {}", deleteChannelRequestId);
    try {
      createDeleteChannelRequestApprover(
          creatorId, deleteChannelRequestId, DeleteChannelRequestStatusType.APPROVED, channelId);
      if (channelType.equals("SIMPLE")) {
        Integer otherMemberId =
            directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(
                channelId, creatorId);
        if (otherMemberId == null) {
          throw new ChannelMemberNotFoundException("Channel member not found.");
        } else {
          createDeleteChannelRequestApprover(
              otherMemberId,
              deleteChannelRequestId,
              DeleteChannelRequestStatusType.PENDING,
              channelId);
        }
      } else if (channelType.equals("GROUP")) {
        List<Integer> otherGroupAdminMemberIds =
            directMessageChannelMemberRepository.getOtherGroupAdminMemberIds(channelId, creatorId);
        log.debug("Group admin members found: {}", otherGroupAdminMemberIds);
        for (Integer memberId : otherGroupAdminMemberIds) {
          createDeleteChannelRequestApprover(
              memberId, deleteChannelRequestId, DeleteChannelRequestStatusType.PENDING, channelId);
        }
      }
    } catch (DataAccessException e) {
      log.error(
          "Database error occured while saving authorized members to delete channel request: {}",
          e.getMessage());
      throw new ChannelDeletionException(
          "Database error occured while saving authorized members to delete channel request: "
              + e.getMessage());
    }
  }

  /**
   * Creates a new Delete Channel Request Approver.
   *
   * @param approverId The ID of the approver.
   * @param deleteChannelRequestId The ID of the delete channel request.
   * @param status The status of the approver.
   */
  public void createDeleteChannelRequestApprover(
      int approverId,
      int deleteChannelRequestId,
      DeleteChannelRequestStatusType status,
      int channelId) {
    log.debug("CREATOR METHOD, APPROVER ID: {}", approverId);
    log.debug("CREATOR METHOD, DELETE REQ ID: {}", deleteChannelRequestId);
    log.debug("CREATOR METHOD, APPROVER STATUS: {}", status);
    DeleteChannelRequestApproverCompositeKey key =
        new DeleteChannelRequestApproverCompositeKey(deleteChannelRequestId, approverId);

    log.debug("CREATOR METHOD, APPROVER KEY: {}", key);
    DeleteChannelRequestApprover approver =
        new DeleteChannelRequestApprover(key, channelId, status);

    log.debug("Creating approver with DELETE_REQUEST_ID: {}", deleteChannelRequestId);
    log.debug("Full Approver Object before save: {}", approver);

    this.deleteChannelRequestApproverRepository.save(approver);
  }

  /**
   * Checks if all approvers have approved the delete request. If all approvers have approved the
   * delete request, the channel is deleted.
   *
   * @param deleteRequestId The ID of the delete request.
   * @param channelId The ID of the channel to delete.
   * @return True if all approvers have approved the delete request, false otherwise.
   */
  public boolean checkDeleteRequestApprovalStatus(int deleteRequestId, int channelId) {
    List<DeleteChannelRequestApprover> approvers =
        this.deleteChannelRequestApproverRepository.findDeleteChannelRequestApproverByStatus(
            DeleteChannelRequestStatusType.APPROVED);
    int totalApprovers =
        this.deleteChannelRequestApproverRepository
            .findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(deleteRequestId)
            .size();
    if (approvers.size() == totalApprovers) {
      log.info("All approvers have approved the delete request. Deleting channel...");
      deleteDirectMessageChannel(channelId);
      return true;
    } else {
      log.info("Not all approvers have approved the delete request.");
      return false;
    }
  }

  public boolean existsOtherAdminChannelMember(int channelId, int accountId) {
    return directMessageChannelMemberRepository.getAdminChannelMembersCount(channelId, accountId)
        > 0;
  }
}
