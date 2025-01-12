package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Direct Message Channel. */
@Repository
public interface DirectMessageChannelRepository
    extends JpaRepository<DirectMessageChannel, Integer> {
  /**
   * Query that gets DTO object for all Direct Message Channels for an account. Uses
   * Constructor-Based Projection to create a List of ListDirectMessageChannelDto.
   *
   * @param accountId Id of the account to get Direct Message Channels for.
   */
  @Query(
      """

      SELECT new com.sportganise.dto.directmessaging.ListDirectMessageChannelDto(
        ch.channelId,
        ch.type,
        ch.name,
        ch.imageBlob,
        m.content,
        cm.read,
        m.sentAt
      )
      FROM DirectMessageChannel ch
      LEFT JOIN DirectMessage m ON ch.lastMessageId = m.messageId
      JOIN DirectMessageChannelMember cm ON ch.channelId = cm.compositeKey.channelId
      WHERE cm.compositeKey.accountId = :accountId
      ORDER BY m.sentAt DESC
      """)
  List<ListDirectMessageChannelDto> getDirectMessageChannelsByAccountId(
      @Param("accountId") int accountId);

  @Transactional
  @Modifying
  @Query("UPDATE DirectMessageChannel SET lastMessageId = :messageId WHERE channelId = :channelId")
  void updateLastMessageId(@Param(("channelId")) int channelId, @Param("messageId") int messageId);
}
