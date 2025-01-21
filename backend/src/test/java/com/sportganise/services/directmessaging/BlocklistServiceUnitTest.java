package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.sportganise.entities.directmessaging.Blocklist;
import com.sportganise.entities.directmessaging.BlocklistCompositeKey;
import com.sportganise.repositories.directmessaging.BlocklistRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class BlocklistServiceUnitTest {
  @Mock private BlocklistRepository blocklistRepository;

  @InjectMocks private BlocklistService blocklistService;

  @Captor private ArgumentCaptor<Blocklist> blocklistCaptor;

  @Test
  public void blockUser_shouldSaveBlocklistEntry() {
    int accountId = 1;
    int blockedAccountId = 2;

    blocklistService.blockUser(accountId, blockedAccountId);

    verify(blocklistRepository, times(1)).save(blocklistCaptor.capture());

    Blocklist savedBlocklist = blocklistCaptor.getValue();
    BlocklistCompositeKey savedKey = savedBlocklist.getCompositeBlocklistId();

    assertEquals(accountId, savedKey.getAccountId());
    assertEquals(blockedAccountId, savedKey.getBlockedId());
  }

  @Test
  public void unblockUser_shouldDeleteBlocklistEntry() {
    int accountId = 1;
    int blockedAccountId = 2;

    BlocklistCompositeKey expectedKey = new BlocklistCompositeKey(accountId, blockedAccountId);

    blocklistService.unblockUser(accountId, blockedAccountId);

    verify(blocklistRepository, times(1)).deleteById(expectedKey);
  }
}
