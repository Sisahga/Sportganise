package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Repository for Direct Message Channel. */
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
                c.channelId, c.type, c.name, c.imageBlob, m.content, cm.read, m.sentAt)
            FROM DirectMessageChannel c
            INNER JOIN DirectMessageChannelMember cm ON c.channelId = cm.compositeKey.channelId
            LEFT JOIN DirectMessage m ON c.channelId = m.channelId AND m.sentAt = (
                        SELECT MAX(sentAt) FROM DirectMessage WHERE channelId = c.channelId)
            WHERE cm.compositeKey.accountId = :accountId
            """)
  List<ListDirectMessageChannelDto> getDirectMessageChannelsByAccountId(
      @Param("accountId") int accountId);

  @Transactional
  @Modifying
  @Query("UPDATE DirectMessageChannel SET lastMessageId = :messageId WHERE channelId = :channelId")
  void updateLastMessageId(@Param(("channelId")) int channelId, @Param("messageId") int messageId);
}
