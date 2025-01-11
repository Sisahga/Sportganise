package com.sportganise.controllers.directmessaging;

import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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
