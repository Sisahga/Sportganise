package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.AddChannelMemberDto;
import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberDeleteException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberFetchException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSaveException;
import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import jakarta.validation.constraints.Null;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller for Direct Message Channel Members. */
@RestController
@RequestMapping("/api/messaging/channelmember")
@Slf4j
public class DirectMessageChannelMemberController {
  private final DirectMessageChannelMemberService directMessageChannelMemberService;

  public DirectMessageChannelMemberController(
      DirectMessageChannelMemberService directMessageChannelMemberService) {
    this.directMessageChannelMemberService = directMessageChannelMemberService;
  }

  /**
   * Add members to a channel.
   *
   * @param addChannelMemberDto The AddChannelMemberDto object.
   * @return ResponseEntity with status 201 if successful, 500 if not.
   * @throws ChannelMemberSaveException if an unexpected error occurs.
   */
  @PostMapping("/add-members")
  public ResponseEntity<ResponseDto<Null>> addMembersToChannel(
      @RequestBody AddChannelMemberDto addChannelMemberDto) {
    try {
      this.directMessageChannelMemberService.saveMembers(
          addChannelMemberDto.getMemberIds(),
          addChannelMemberDto.getChannelId(),
          addChannelMemberDto.getAdminId());
      log.info("Successfully added members to channel: {}", addChannelMemberDto.getChannelId());
      ResponseDto<Null> response =
          new ResponseDto<>(HttpStatus.CREATED.value(), "Members added successfully", null);
      return new ResponseEntity<>(response, HttpStatus.CREATED);
    } catch (Exception e) {
      log.error(
          "Failed to add members to channel: {}. Error: {}",
          addChannelMemberDto.getChannelId(),
          e.getMessage());
      throw new ChannelMemberSaveException(
          "An unexpected error occured when trying to add members to channel.");
    }
  }

  /**
   * Get all members of a channel besides the current session user.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return ResponseEntity with status 201 and a list of channel members if successful.
   * @throws ChannelMemberFetchException if an unexpected error occurs.
   */
  @GetMapping("/get-channel-members/{channelId}/{accountId}")
  public ResponseEntity<ResponseDto<List<ChannelMembersDto>>> getChannelMembers(
      @PathVariable int channelId, @PathVariable int accountId) {
    try {
      List<ChannelMembersDto> channelMembersDto =
          this.directMessageChannelMemberService.getNonUserChannelMembers(channelId, accountId);
      log.debug("Channel members excluding current user retrieved successfully");
      ResponseDto<List<ChannelMembersDto>> response =
          new ResponseDto<>(
              HttpStatus.OK.value(), "Channel members retrieved successfully", channelMembersDto);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      log.error(
          "Failed to get channel members for channel id: {} and account id: {}. Error: {}",
          channelId,
          accountId,
          e.getMessage());
      throw new ChannelMemberFetchException(
          "An unexpected error occured when trying to get channel members.");
    }
  }

  /**
   * Get all members of a channel.
   *
   * @param channelId The channel id.
   * @return ResponseEntity with status 201 and a list of channel members if successful.
   */
  @GetMapping("/get-channel-members/{channelId}")
  public ResponseEntity<ResponseDto<List<ChannelMembersDto>>> getAllChannelMembers(
      @PathVariable int channelId) {
    try {
      List<ChannelMembersDto> channelMembersDto =
          this.directMessageChannelMemberService.getAllChannelMembers(channelId);
      log.debug("Channel members retrieved successfully");
      ResponseDto<List<ChannelMembersDto>> response =
          new ResponseDto<>(
              HttpStatus.OK.value(), "Channel members retrieved successfully", channelMembersDto);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      log.error(
          "Failed to get channel members for channel id: {}. Error: {}", channelId, e.getMessage());
      throw new ChannelMemberFetchException(
          "An unexpected error occured when trying to get channel members.");
    }
  }

  /**
   * Marks a channel as read for a specific account.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return ResponseEntity with status 200 if successful, 404 if not.
   */
  @PutMapping("/{channelId}/{accountId}/mark-as-read")
  public ResponseEntity<ResponseDto<Void>> markChannelAsRead(
      @PathVariable int channelId, @PathVariable int accountId) {
    int updatedRows =
        this.directMessageChannelMemberService.markChannelAsRead(channelId, accountId);
    if (updatedRows == 0) {
      log.error(
          "Channel not found when trying to mark as read for channel id: {} and account id: {}",
          channelId,
          accountId);
      throw new ChannelNotFoundException("Channel not found when trying to mark as read.");
    }
    log.info(
        "Successfully marked channel as read for channel id: {} and account id: {}",
        channelId,
        accountId);
    ResponseDto<Void> response =
        new ResponseDto<>(HttpStatus.OK.value(), "Channel marked as read successfully", null);
    return ResponseEntity.ok(response);
  }

  /**
   * Remove a user from a channel.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return ResponseEntity with status 200 if successful.
   */
  @DeleteMapping("/remove/{channelId}/{accountId}")
  public ResponseEntity<ResponseDto<Null>> removeChannelMember(
      @PathVariable int channelId, @PathVariable int accountId) {
    try {
      this.directMessageChannelMemberService.removeMemberFromChannel(channelId, accountId);
      log.info("Successfully deleted channel member by channel id: {}", channelId);
      ResponseDto<Null> response =
          new ResponseDto<>(HttpStatus.OK.value(), "Channel member deleted successfully", null);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      log.error(
          "Unexpected error removing member: {} from channel: {}: {}",
          accountId,
          channelId,
          e.getMessage());

      throw new ChannelMemberDeleteException(
          "An unexpected error occured when trying to delete channel member.");
    }
  }
}
