package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.directmessaging.BlockUserRequestDto;
import com.sportganise.services.directmessaging.BlocklistService;
import jakarta.validation.constraints.Null;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST Controller for handling HTTP requests related to Blocklist. */
@RestController
@RequestMapping("/api/blocklist")
@Slf4j
public class BlocklistController {
  private final BlocklistService blocklistService;

  public BlocklistController(BlocklistService blocklistService) {
    this.blocklistService = blocklistService;
  }

  /**
   * Endpoint /api/blocklist/block: Post Mapping for blocking a user.
   *
   * @param blockUserRequestDto API object for blocking a user.
   * @return HTTP Code 204 and No Content.
   */
  @PostMapping("/block")
  public ResponseEntity<ResponseDto<Null>> blockUser(
      @RequestBody BlockUserRequestDto blockUserRequestDto) {
    blocklistService.blockUser(
        blockUserRequestDto.getAccountId(), blockUserRequestDto.getBlockedId());
    ResponseDto<Null> response =
        new ResponseDto<>(HttpStatus.NO_CONTENT.value(), "User blocked successfully", null);
    return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
  }
}
