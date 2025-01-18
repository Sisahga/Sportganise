package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

  @Query(
      """
      SELECT cm.compositeKey.accountId, a.firstName, a.pictureUrl
      FROM DirectMessageChannelMember cm
      JOIN Account a ON cm.compositeKey.accountId = a.accountId
      WHERE cm.compositeKey.channelId = :channelId
      """)
  List<Object[]> getChannelMembersDetails(int channelId);

  @Transactional
  @Modifying
  @Query(
      """
        UPDATE DirectMessageChannelMember cm
        SET cm.read = true
        WHERE cm.compositeKey.channelId = :channelId AND cm.compositeKey.accountId = :accountId
        """)
  int updateChannelMemberReadStatus(
      @Param("accountId") int accountId, @Param("channelId") int channelId);

  @Query(
      """
        SELECT new com.sportganise.dto.directmessaging.ChannelMembersDto(
            cm.compositeKey.accountId,
            a.firstName,
            a.lastName,
            a.pictureUrl,
            cm.role
        )
        FROM DirectMessageChannelMember cm
        JOIN Account a ON cm.compositeKey.accountId = a.accountId
        WHERE cm.compositeKey.channelId = :channelId
        AND cm.compositeKey.accountId != :accountId
        """)
  List<ChannelMembersDto> getNonUserChannelMembers(int channelId, int accountId);

  @Query(
      """
              SELECT new com.sportganise.dto.directmessaging.ChannelMembersDto(
                  cm.compositeKey.accountId,
                  a.firstName,
                  a.lastName,
                  a.pictureUrl,
                  cm.role
              )
              FROM DirectMessageChannelMember cm
              JOIN Account a ON cm.compositeKey.accountId = a.accountId
              WHERE cm.compositeKey.channelId = :channelId
              """)
  List<ChannelMembersDto> getAllChannelMembers(int channelId);

  @Transactional
  @Modifying
  @Query(
      """
        DELETE FROM DirectMessageChannelMember cm
        WHERE cm.compositeKey.channelId = :channelId AND cm.compositeKey.accountId = :accountId
        """)
  void deleteByChannelIdAndAccountId(int channelId, int accountId);
}
