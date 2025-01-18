package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class DirectMessageChannelMemberServiceUnitTest {
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  @InjectMocks private DirectMessageChannelMemberService directMessageChannelMemberService;
  @Captor private ArgumentCaptor<List<DirectMessageChannelMember>> membersCaptor;

  @Test
  public void getNonUserChannelMembers_shouldReturnMembersExcludingUser() {
    int channelId = 1;
    int accountId = 100;

    List<ChannelMembersDto> expectedMembers =
        Arrays.asList(new ChannelMembersDto(), new ChannelMembersDto());

    when(directMessageChannelMemberRepository.getNonUserChannelMembers(channelId, accountId))
        .thenReturn(expectedMembers);

    List<ChannelMembersDto> actualMembers =
        directMessageChannelMemberService.getNonUserChannelMembers(channelId, accountId);

    assertEquals(expectedMembers, actualMembers);
    verify(directMessageChannelMemberRepository, times(1))
        .getNonUserChannelMembers(channelId, accountId);
  }

  @Test
  public void getAllChannelMembers_shouldReturnAllMembers() {
    int channelId = 1;

    List<ChannelMembersDto> expectedMembers =
        Arrays.asList(new ChannelMembersDto(), new ChannelMembersDto(), new ChannelMembersDto());

    when(directMessageChannelMemberRepository.getAllChannelMembers(channelId))
        .thenReturn(expectedMembers);

    List<ChannelMembersDto> actualMembers =
        directMessageChannelMemberService.getAllChannelMembers(channelId);

    assertEquals(expectedMembers, actualMembers);
    verify(directMessageChannelMemberRepository, times(1)).getAllChannelMembers(channelId);
  }

  @Test
  public void saveMembers_shouldSaveAllMembersWithCorrectProperties() {
    int channelId = 1;
    int creatorId = 100;
    List<Integer> memberIds = Arrays.asList(100, 101, 102);

    directMessageChannelMemberService.saveMembers(memberIds, channelId, creatorId);

    verify(directMessageChannelMemberRepository).saveAll(membersCaptor.capture());
    List<DirectMessageChannelMember> savedMembers = membersCaptor.getValue();

    assertEquals(memberIds.size(), savedMembers.size());

    for (int i = 0; i < memberIds.size(); i++) {
      DirectMessageChannelMember member = savedMembers.get(i);
      DirectMessageChannelMemberCompositeKey key = member.getCompositeKey();

      assertEquals(channelId, key.getChannelId());
      assertEquals(memberIds.get(i), key.getAccountId());
      assertEquals(memberIds.get(i) == creatorId, member.getRead());
    }
  }

  @Test
  public void markChannelAsRead_shouldUpdateReadStatus() {
    int channelId = 1;
    int accountId = 100;
    int expectedAffectedRows = 1;

    when(directMessageChannelMemberRepository.updateChannelMemberReadStatus(accountId, channelId))
        .thenReturn(expectedAffectedRows);

    int actualAffectedRows =
        directMessageChannelMemberService.markChannelAsRead(channelId, accountId);

    assertEquals(expectedAffectedRows, actualAffectedRows);
    verify(directMessageChannelMemberRepository, times(1))
        .updateChannelMemberReadStatus(accountId, channelId);
  }
}
