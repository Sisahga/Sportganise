package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Repository for a Direct Channel Member. */
public interface DirectMessageChannelMemberRepository
    extends JpaRepository<DirectMessageChannelMember, DirectMessageChannelMemberCompositeKey> {
  @Transactional
  @Modifying
  @Query("DELETE FROM DirectMessageChannelMember d WHERE d.compositeKey.channelId = :channelId")
  void deleteDirectMessageChannelMemberByChannelId(@Param("channelId") int channelId);

  @Query(
      """
            SELECT d.compositeKey.accountId
            FROM DirectMessageChannelMember d
            WHERE d.compositeKey.channelId = :channelId
            AND d.compositeKey.accountId != :accountId
      """)
  int getOtherMemberIdInSimpleChannel(
      @Param("channelId") int channelId, @Param("accountId") int accountId);

  /**
   * Sets the read status for a channel's member to true when it is the sender id, false when it is
   * not.
   *
   * @param channelId Channel ID to update read status for.
   * @param senderId Sender ID of the message.
   */
  @Transactional
  @Modifying
  @Query(
      """
            UPDATE DirectMessageChannelMember
            SET read = CASE
                WHEN compositeKey.accountId = :senderId THEN true
                ELSE false
            END
            WHERE compositeKey.accountId IN (
                SELECT compositeKey.accountId
                FROM DirectMessageChannelMember
                WHERE compositeKey.channelId = :channelId
            )
        """)
  void updateReadStatus(@Param("channelId") int channelId, @Param("senderId") int senderId);
}
