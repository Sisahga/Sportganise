package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.ChannelMembersDto;
import com.sportganise.entities.directmessaging.ChannelMemberRoleType;
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

  @Query(
      """
            SELECT d.compositeKey.accountId
            FROM DirectMessageChannelMember d
            WHERE d.compositeKey.channelId = :channelId
            AND d.compositeKey.accountId != :accountId
      """)
  Integer getOtherMemberIdInSimpleChannel(
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
            SET cm.read = CASE
                WHEN cm.compositeKey.accountId = :accountId THEN true
                ELSE false
            END
            WHERE cm.compositeKey.channelId = :channelId
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

  @Modifying
  @Query(
      """
        UPDATE DirectMessageChannelMember cm
        SET cm.role = :role
        WHERE cm.compositeKey.accountId = :memberId AND cm.compositeKey.channelId = :channelId
        """)
  int setChannelMemberRole(int memberId, int channelId, ChannelMemberRoleType role);

  @Query(
      """
        SELECT cm.compositeKey.accountId
        FROM DirectMessageChannelMember cm
        WHERE cm.compositeKey.channelId = :channelId
        AND cm.role = 'ADMIN'
        AND cm.compositeKey.accountId != :accountId
        """)
  List<Integer> getOtherGroupAdminMemberIds(int channelId, int accountId);

  @Query(
      """
          SELECT COUNT(*)
          FROM DirectMessageChannelMember cm
          WHERE cm.compositeKey.channelId = :channelId
            AND cm.compositeKey.accountId != :accountId
            AND cm.role = 'ADMIN'
        """)
  int getAdminChannelMembersCount(int channelId, int accountId);
}
