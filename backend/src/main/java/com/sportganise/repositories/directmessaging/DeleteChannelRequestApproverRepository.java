package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.DeleteChannelRequestMembersDto;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApprover;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApproverCompositeKey;
import java.util.List;
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
          AND dcra.approverCompositeKey.approverId != :accountId
          """)
  List<DeleteChannelRequestMembersDto> getChannelMembersDetailsForDeleteRequest(
      List<Integer> memberIds, int deleteRequestId);
}
