package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.sportganise.dto.directmessaging.DeleteChannelRequestResponseDto;
import com.sportganise.dto.directmessaging.SetDeleteApproverStatusDto;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApprover;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApproverCompositeKey;
import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.exceptions.channelexceptions.ChannelDeletionException;
import com.sportganise.exceptions.channelexceptions.ChannelNotFoundException;
import com.sportganise.exceptions.channelmemberexceptions.ChannelMemberNotFoundException;
import com.sportganise.exceptions.deletechannelrequestexceptions.DeleteChannelApproverException;
import com.sportganise.repositories.directmessaging.DeleteChannelRequestApproverRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;

public class DeleteChannelRequestServiceUnitTest {
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  @Mock private DeleteChannelRequestApproverRepository deleteChannelRequestApproverRepository;
  @Mock private DirectMessageChannelRepository directMessageChannelRepository;
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

  @Test
  void testDeleteDirectMessageChannel_Success() {
    int channelId = 100;

    when(directMessageChannelRepository.existsById(channelId)).thenReturn(true);
    assertDoesNotThrow(() -> directMessageChannelService.deleteDirectMessageChannel(channelId));
    verify(directMessageChannelRepository).deleteById(channelId);
  }

  @Test
  void testDeleteDirectMessageChannel_NotFound() {
    int channelId = 100;

    when(directMessageChannelRepository.existsById(channelId)).thenReturn(false);
    assertThrows(
        ChannelNotFoundException.class,
        () -> directMessageChannelService.deleteDirectMessageChannel(channelId));
  }

  @Test
  void testCheckDeleteRequestApprovalStatus_AllApproved() {
    int deleteRequestId = 1;
    int channelId = 100;

    // Spy the service to verify method calls
    DirectMessageChannelService spyService = spy(directMessageChannelService);

    DeleteChannelRequestApprover approver1 = mock(DeleteChannelRequestApprover.class);
    DeleteChannelRequestApprover approver2 = mock(DeleteChannelRequestApprover.class);
    List<DeleteChannelRequestApprover> approvedApprovers = Arrays.asList(approver1, approver2);

    List<DeleteChannelRequestApprover> totalApprovers = Arrays.asList(approver1, approver2);

    when(deleteChannelRequestApproverRepository.findDeleteChannelRequestApproverByStatus(
            DeleteChannelRequestStatusType.APPROVED))
        .thenReturn(approvedApprovers);
    when(deleteChannelRequestApproverRepository
            .findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(
                deleteRequestId))
        .thenReturn(totalApprovers);

    when(directMessageChannelRepository.existsById(channelId)).thenReturn(true);

    boolean result = spyService.checkDeleteRequestApprovalStatus(deleteRequestId, channelId);

    assertTrue(result);
    verify(spyService).deleteDirectMessageChannel(channelId);
  }

  @Test
  void testCheckDeleteRequestApprovalStatus_NotAllApproved() {
    int deleteRequestId = 1;
    int channelId = 100;

    DirectMessageChannelService spyService = spy(directMessageChannelService);

    DeleteChannelRequestApprover approver1 = mock(DeleteChannelRequestApprover.class);
    List<DeleteChannelRequestApprover> approvedApprovers = Collections.singletonList(approver1);

    DeleteChannelRequestApprover approver2 = mock(DeleteChannelRequestApprover.class);
    List<DeleteChannelRequestApprover> totalApprovers = Arrays.asList(approver1, approver2);

    when(deleteChannelRequestApproverRepository.findDeleteChannelRequestApproverByStatus(
            DeleteChannelRequestStatusType.APPROVED))
        .thenReturn(approvedApprovers);
    when(deleteChannelRequestApproverRepository
            .findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(
                deleteRequestId))
        .thenReturn(totalApprovers);

    boolean result = spyService.checkDeleteRequestApprovalStatus(deleteRequestId, channelId);

    assertFalse(result);
    verify(spyService, never()).deleteDirectMessageChannel(channelId);
    verify(deleteChannelRequestApproverRepository)
        .findDeleteChannelRequestApproverByStatus(DeleteChannelRequestStatusType.APPROVED);
    verify(deleteChannelRequestApproverRepository)
        .findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(deleteRequestId);
  }

  @Test
  void setDeleteApproverStatus_ApproveChannelDeleted() {
    int accountId = 1;
    int deleteRequestId = 100;
    int channelId = 200;

    SetDeleteApproverStatusDto statusDto = new SetDeleteApproverStatusDto();
    statusDto.setAccountId(accountId);
    statusDto.setDeleteRequestId(deleteRequestId);
    statusDto.setChannelId(channelId);
    statusDto.setStatus("APPROVED");

    DeleteChannelRequestApproverCompositeKey key =
        new DeleteChannelRequestApproverCompositeKey(accountId, deleteRequestId);

    DeleteChannelRequestApprover approver = mock(DeleteChannelRequestApprover.class);

    DirectMessageChannelService spyService = spy(directMessageChannelService);

    when(deleteChannelRequestApproverRepository.findById(key)).thenReturn(Optional.of(approver));

    when(directMessageChannelRepository.existsById(channelId)).thenReturn(true);

    doReturn(true).when(spyService).checkDeleteRequestApprovalStatus(deleteRequestId, channelId);

    doNothing().when(spyService).deleteDirectMessageChannel(channelId);

    DeleteChannelRequestResponseDto result = spyService.setDeleteApproverStatus(statusDto);

    assertNull(result);
    verify(deleteChannelRequestApproverRepository).save(approver);
  }

  @Test
  void setDeleteApproverStatus_ApproveChannelNotDeleted() {
    int accountId = 1;
    int deleteRequestId = 100;
    int channelId = 200;

    SetDeleteApproverStatusDto statusDto = new SetDeleteApproverStatusDto();
    statusDto.setAccountId(accountId);
    statusDto.setDeleteRequestId(deleteRequestId);
    statusDto.setChannelId(channelId);
    statusDto.setStatus("APPROVED");

    DeleteChannelRequestApproverCompositeKey key =
        new DeleteChannelRequestApproverCompositeKey(accountId, deleteRequestId);

    DeleteChannelRequestApprover approver = mock(DeleteChannelRequestApprover.class);
    DirectMessageChannel channel = mock(DirectMessageChannel.class);

    DirectMessageChannelService spyService = spy(directMessageChannelService);

    when(deleteChannelRequestApproverRepository.findById(key)).thenReturn(Optional.of(approver));

    when(directMessageChannelRepository.existsById(channelId)).thenReturn(true);

    doReturn(false).when(spyService).checkDeleteRequestApprovalStatus(deleteRequestId, channelId);

    when(directMessageChannelRepository.findById(channelId)).thenReturn(Optional.of(channel));

    when(channel.getType()).thenReturn("GROUP");

    when(deleteChannelRequestApproverRepository.getChannelMembersDetailsForDeleteRequest(
            deleteRequestId))
        .thenReturn(Collections.emptyList());

    DeleteChannelRequestResponseDto result = spyService.setDeleteApproverStatus(statusDto);

    assertNotNull(result);
    assertEquals(deleteRequestId, result.getDeleteChannelRequestDto().getDeleteRequestId());
    verify(deleteChannelRequestApproverRepository).save(approver);
  }

  @Test
  void setDeleteApproverStatus_ApproverNotFound() {
    SetDeleteApproverStatusDto statusDto = new SetDeleteApproverStatusDto();
    statusDto.setAccountId(1);
    statusDto.setDeleteRequestId(100);
    statusDto.setStatus("APPROVED");

    DeleteChannelRequestApproverCompositeKey key =
        new DeleteChannelRequestApproverCompositeKey(1, 100);

    when(deleteChannelRequestApproverRepository.findById(key)).thenReturn(Optional.empty());

    assertThrows(
        DeleteChannelApproverException.class,
        () -> directMessageChannelService.setDeleteApproverStatus(statusDto));
  }
}
