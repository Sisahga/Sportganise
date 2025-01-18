package com.sportganise.repositories.directmessaging;

import com.sportganise.dto.directmessaging.LastMessageDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/** Repository for Direct Message. */
@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Integer> {
  @Query(
      """
          SELECT m
          FROM DirectMessage m
          WHERE m.channelId = :channelId
          ORDER BY m.sentAt ASC
          LIMIT 30
         """)
  List<DirectMessage> getMessagesByChannelId(int channelId);

  @Query(
      """
          SELECT dmb.blobUrl
          FROM DirectMessageBlob dmb
          WHERE dmb.messageId = :messageId
         """)
  List<String> getMessageAttachments(int messageId);

  @Query(
      """
        SELECT NEW com.sportganise.dto.directmessaging.LastMessageDto(
            m.senderId,
            m.channelId,
            m.content,
            m.type)
        FROM DirectMessage m
        WHERE m.messageId = (
            SELECT c.lastMessageId
            FROM DirectMessageChannel c
            WHERE c.channelId = :channelId)
        """)
  LastMessageDto getLastMessageByChannelId(int channelId);

  // TODO: Query to fetch next set of messages based on the last sentAt of the last message in the
  // current list.
}
