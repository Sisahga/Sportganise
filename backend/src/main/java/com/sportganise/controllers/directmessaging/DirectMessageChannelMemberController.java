package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
   * Get all members of a channel besides the current session user.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return ResponseEntity with status 201 and a list of channel members if successful.
   */
  @GetMapping("/get-channel-members/{channelId}/{accountId}")
  public ResponseEntity<ResponseDto<List<ChannelMembersDto>>> getChannelMembers(
          @PathVariable int channelId, @PathVariable int accountId) {
    List<ChannelMembersDto> channelMembersDto =
        this.directMessageChannelMemberService.getNonUserChannelMembers(channelId, accountId);
    log.debug("Channel members excluding current user retrieved successfully");
    ResponseDto<List<ChannelMembersDto>> response =
        new ResponseDto<>(
                HttpStatus.OK.value(),
                "Channel members retrieved successfully",
                channelMembersDto);
    return new ResponseEntity<>(response, HttpStatus.OK);
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
    List<ChannelMembersDto> channelMembersDto =
        this.directMessageChannelMemberService.getAllChannelMembers(channelId);
    log.debug("Channel members retrieved successfully");
    ResponseDto<List<ChannelMembersDto>> response =
        new ResponseDto<>(
                HttpStatus.OK.value(),
                "Channel members retrieved successfully",
                channelMembersDto);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  /**
   * Marks a channel as read for a specific account.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return ResponseEntity with status 200 if successful, 404 if not.
   */
  @PutMapping("/{channelId}/{accountId}/mark-as-read")
  public ResponseEntity<Void> markChannelAsRead(
      @PathVariable int channelId, @PathVariable int accountId) {
    int updatedRows =
        this.directMessageChannelMemberService.markChannelAsRead(channelId, accountId);
    if (updatedRows == 0) {
      log.error(
          "Failed to mark channel as read for channel id: {} and account id: {}",
          channelId,
          accountId);
      return ResponseEntity.notFound().build();
    }
    log.info(
        "Successfully marked channel as read for channel id: {} and account id: {}",
        channelId,
        accountId);
    return ResponseEntity.ok().build();
  }
}
