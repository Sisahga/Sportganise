package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.Blocklist;
import com.sportganise.entities.directmessaging.BlocklistCompositeKey;
import com.sportganise.repositories.directmessaging.BlocklistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for handling blocklist operations.
 */
@Service
@Slf4j
public class BlocklistService {
  private final BlocklistRepository blocklistRepository;

  public BlocklistService(BlocklistRepository blocklistRepository) {
    this.blocklistRepository = blocklistRepository;
  }

  /**
   * Blocks a user.
   *
   * @param accountId        The account ID of the user blocking the other user
   * @param blockedAccountId The account ID of the user being blocked
   */
  public void blockUser(int accountId, int blockedAccountId) {
    BlocklistCompositeKey blocklistCompositeKey =
            new BlocklistCompositeKey(accountId, blockedAccountId);
    Blocklist blocklist = new Blocklist(blocklistCompositeKey);
    blocklistRepository.save(blocklist);
    log.info("User with account ID {} has blocked user with account ID {}", accountId, blockedAccountId);
  }

  public void unblockUser(int accountId, int blockedAccountId) {
    BlocklistCompositeKey blocklistCompositeKey =
            new BlocklistCompositeKey(accountId, blockedAccountId);
    blocklistRepository.deleteById(blocklistCompositeKey);
    log.info("User with account ID {} has unblocked user with account ID {}", accountId, blockedAccountId);
  }
}
