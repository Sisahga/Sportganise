package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.DeleteChannelRequestMembersDto;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApprover;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApproverCompositeKey;
import java.util.List;

import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Repository for handling approvers for a delete channel request. */
public interface DeleteChannelRequestApproverRepository
    extends JpaRepository<DeleteChannelRequestApprover, DeleteChannelRequestApproverCompositeKey> {
  @Query(
      """
          SELECT new com.sportganise.dto.directmessaging.DeleteChannelRequestMembersDto(
              a.accountId,
              a.firstName,
              a.lastName,
              a.pictureUrl,
              dcra.status
          )
          FROM DeleteChannelRequestApprover dcra
          JOIN Account a ON dcra.approverCompositeKey.approverId = a.accountId
          WHERE dcra.approverCompositeKey.deleteRequestId = :deleteRequestId
          """)
  List<DeleteChannelRequestMembersDto> getChannelMembersDetailsForDeleteRequest(
      int deleteRequestId);

  List<DeleteChannelRequestApprover>
  findDeleteChannelRequestApproverByApproverCompositeKey_DeleteRequestId(
          Integer approverCompositeKeyDeleteRequestId);

  List<DeleteChannelRequestApprover> findDeleteChannelRequestApproverByStatus(
          DeleteChannelRequestStatusType status);
}
