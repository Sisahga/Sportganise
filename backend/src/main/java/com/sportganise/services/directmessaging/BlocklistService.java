package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.Blocklist;
import com.sportganise.entities.directmessaging.BlocklistCompositeKey;
import com.sportganise.repositories.directmessaging.BlocklistRepository;
import org.springframework.stereotype.Service;

@Service
public class BlocklistService {
  private final BlocklistRepository blocklistRepository;
  public BlocklistService(BlocklistRepository blocklistRepository) {
    this.blocklistRepository = blocklistRepository;
  }

  public void blockUser(int accountId, int blockedAccountId) {
    BlocklistCompositeKey blocklistCompositeKey = new BlocklistCompositeKey(accountId, blockedAccountId);
    Blocklist blocklist = new Blocklist(blocklistCompositeKey);
    blocklistRepository.save(blocklist);
  }
}
