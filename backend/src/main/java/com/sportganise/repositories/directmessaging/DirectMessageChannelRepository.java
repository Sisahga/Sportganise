package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.DuplicateChannelDto;
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

  /**
   * Query that checks if a Direct Message Channel exists by its channel hash (prevent duplicate
   * channels).
   *
   * @param channelHash Hash of the channel to check.
   * @return DTO object for the Direct Message Channel.
   */
  @Query(
      """
          SELECT new com.sportganise.dto.directmessaging.DuplicateChannelDto(
                  ch.channelId, ch.name, ch.type, ch.imageBlob)
          FROM DirectMessageChannel ch
          WHERE ch.channelHash = :channelHash
        """)
  DuplicateChannelDto findChannelByChannelHash(@Param("channelHash") String channelHash);

  @Transactional
  @Modifying
  @Query(
      """
          UPDATE DirectMessageChannel dmc
          SET dmc.name = :channelName
          WHERE dmc.channelId = :channelId
          """)
  int renameChannel(int channelId, String channelName);

  @Transactional
  @Modifying
  @Query(
      """
        UPDATE DirectMessageChannel dmc
        SET dmc.imageBlob = :imageObjectUrl
        WHERE dmc.channelId = :channelId
      """)
  int updateChannelImage(int channelId, String imageObjectUrl);

  @Query(
      """
        SELECT dmc.imageBlob
        FROM DirectMessageChannel dmc
        WHERE dmc.channelId = :channelId
      """)
  String getDirectMessageChannelImageBlob(int channelId);
}
