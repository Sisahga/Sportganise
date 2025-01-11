package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Repository for a Direct Channel Member. */
@Repository
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

  @Query(
      """
      SELECT cm.compositeKey.accountId, a.firstName, a.pictureBlob
      FROM DirectMessageChannelMember cm
      JOIN Account a ON cm.compositeKey.accountId = a.accountId
      WHERE cm.compositeKey.channelId = :channelId
      """)
  List<Object[]> getChannelMembersDetails(int channelId);

  @Transactional
  @Modifying
  @Query("""
        UPDATE DirectMessageChannelMember cm
        SET cm.read = true
        WHERE cm.compositeKey.channelId = :channelId AND cm.compositeKey.accountId = :accountId
        """)
  int updateChannelMemberReadStatus(@Param("accountId") int accountId, @Param("channelId") int channelId);
}
