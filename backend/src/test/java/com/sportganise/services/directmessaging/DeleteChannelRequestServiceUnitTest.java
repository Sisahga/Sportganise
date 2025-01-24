package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import com.sportganise.exceptions.channelexceptions.ChannelDeletionException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberNotFoundException;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestApproverRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;

public class DeleteChannelRequestServiceUnitTest {
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;

  @Mock private DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository;

  @InjectMocks private DirectMessageChannelService directMessageChannelService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void saveAuthorizedMembersToDeleteChannelRequest_SimpleChannel_Success() {
    int channelId = 1;
    int creatorId = 2;
    int deleteChannelRequestId = 3;
    Integer otherMemberId = 4;

    when(directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(channelId, creatorId))
        .thenReturn(otherMemberId);

    directMessageChannelService.saveAuthorizedMembersToDeleteChannelRequest(
        channelId, "SIMPLE", creatorId, deleteChannelRequestId);

    verify(deleteChannelRequestApproverRepository, times(2)).save(any());
    verify(directMessageChannelMemberRepository)
        .getOtherMemberIdInSimpleChannel(channelId, creatorId);
  }

  @Test
  void saveAuthorizedMembersToDeleteChannelRequest_GroupChannel_Success() {
    int channelId = 1;
    int creatorId = 2;
    int deleteChannelRequestId = 3;
    Integer[] otherAdminIds = {4, 5, 6};

    when(directMessageChannelMemberRepository.getOtherGroupAdminMemberIds(channelId, creatorId))
        .thenReturn(java.util.Arrays.asList(otherAdminIds));

    directMessageChannelService.saveAuthorizedMembersToDeleteChannelRequest(
        channelId, "GROUP", creatorId, deleteChannelRequestId);

    verify(deleteChannelRequestApproverRepository, times(otherAdminIds.length + 1)).save(any());
  }

  @Test
  void saveAuthorizedMembersToDeleteChannelRequest_SimpleChannel_MemberNotFound() {
    int channelId = 1;
    int creatorId = 2;
    int deleteChannelRequestId = 3;

    when(directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(channelId, creatorId))
        .thenReturn(null);

    assertThrows(
        ChannelMemberNotFoundException.class,
        () ->
            directMessageChannelService.saveAuthorizedMembersToDeleteChannelRequest(
                channelId, "SIMPLE", creatorId, deleteChannelRequestId));
  }

  @Test
  void createDeleteChannelRequestApprover_Success() {
    int approverId = 1;
    int deleteChannelRequestId = 2;
    DeleteChannelRequestStatusType status = DeleteChannelRequestStatusType.PENDING;

    directMessageChannelService.createDeleteChannelRequestApprover(
        approverId, deleteChannelRequestId, status);

    verify(deleteChannelRequestApproverRepository).save(any());
  }

  @Test
  void saveAuthorizedMembersToDeleteChannelRequest_DatabaseError() {
    int channelId = 1;
    int creatorId = 2;
    int deleteChannelRequestId = 3;
    Integer otherMemberId = 4;

    when(directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(channelId, creatorId))
        .thenReturn(otherMemberId);

    doThrow(new DataAccessException("Database error") {})
        .when(deleteChannelRequestApproverRepository)
        .save(any());

    assertThrows(
        ChannelDeletionException.class,
        () ->
            directMessageChannelService.saveAuthorizedMembersToDeleteChannelRequest(
                channelId, "SIMPLE", creatorId, deleteChannelRequestId));
  }
}
