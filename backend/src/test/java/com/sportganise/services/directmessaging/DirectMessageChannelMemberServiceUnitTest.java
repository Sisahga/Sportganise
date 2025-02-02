package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.ChannelMemberRoleType;
import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberSetRoleException;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestApproverRepository;
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
import org.springframework.dao.DataAccessException;

@ExtendWith(MockitoExtension.class)
public class DirectMessageChannelMemberServiceUnitTest {
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  @Mock private DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository;
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

  @Test
  public void removeMemberFromChannel_shouldDeleteMember() {
    int channelId = 1;
    int accountId = 100;

    directMessageChannelMemberService.removeMemberFromChannel(channelId, accountId);

    verify(directMessageChannelMemberRepository, times(1))
        .deleteByChannelIdAndAccountId(channelId, accountId);
  }

  @Test
  public void removeMemberFromChannel_whenRepositoryThrowsException_shouldPropagateException() {
    int channelId = 1;
    int accountId = 100;

    doThrow(new RuntimeException("Database error"))
        .when(directMessageChannelMemberRepository)
        .deleteByChannelIdAndAccountId(channelId, accountId);

    assertThrows(
        RuntimeException.class,
        () -> directMessageChannelMemberService.removeMemberFromChannel(channelId, accountId));

    verify(directMessageChannelMemberRepository, times(1))
        .deleteByChannelIdAndAccountId(channelId, accountId);
  }

  @Test
  public void setGroupMemberRole_successfulRoleSet() {
    int memberId = 100;
    int channelId = 1;
    ChannelMemberRoleType role = ChannelMemberRoleType.ADMIN;

    when(directMessageChannelMemberRepository.setChannelMemberRole(memberId, channelId, role))
        .thenReturn(1);

    directMessageChannelMemberService.setGroupMemberRole(memberId, channelId, role);

    verify(directMessageChannelMemberRepository).setChannelMemberRole(memberId, channelId, role);
  }

  @Test
  public void setGroupMemberRole_noRowsAffected_throwsException() {
    int memberId = 100;
    int channelId = 1;
    ChannelMemberRoleType role = ChannelMemberRoleType.REGULAR;

    when(directMessageChannelMemberRepository.setChannelMemberRole(memberId, channelId, role))
        .thenReturn(0);

    assertThrows(
        ChannelMemberSetRoleException.class,
        () -> directMessageChannelMemberService.setGroupMemberRole(memberId, channelId, role));
  }

  @Test
  public void setGroupMemberRole_databaseError_throwsException() {
    int memberId = 100;
    int channelId = 1;
    ChannelMemberRoleType role = ChannelMemberRoleType.REGULAR;

    when(directMessageChannelMemberRepository.setChannelMemberRole(memberId, channelId, role))
        .thenThrow(new DataAccessException("Database error") {});

    assertThrows(
        ChannelMemberSetRoleException.class,
        () -> directMessageChannelMemberService.setGroupMemberRole(memberId, channelId, role));
  }
}
