package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.DeleteChannelRequestMembersDto;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApprover;
import com.sportganise.entities.directmessaging.DeleteChannelRequestApproverCompositeKey;
import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import java.util.List;
import java.util.Optional;
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

  @Query(
      """
          SELECT dcra
          FROM DeleteChannelRequestApprover dcra
          WHERE dcra.approverCompositeKey.deleteRequestId = :deleteRequestId
          AND dcra.approverCompositeKey.approverId = :approverId
        """)
  Optional<DeleteChannelRequestApprover> findByKey(int deleteRequestId, int approverId);

  @Query(
      """
          SELECT dcra
          FROM DeleteChannelRequestApprover dcra
          JOIN DeleteChannelRequest dcr ON dcra.approverCompositeKey.deleteRequestId = dcr.deleteRequestId
          WHERE dcr.channelId = :channelId
          AND dcra.approverCompositeKey.approverId = :accountId
        """)
  Optional<DeleteChannelRequestApprover> approverExists(int channelId, int accountId);
}
