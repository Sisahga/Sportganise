package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Repository for Direct Message. */
@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Integer> {
  @Query("""
          SELECT m
          FROM DirectMessage m
          WHERE m.channelId = :channelId
          ORDER BY m.sentAt ASC
          LIMIT 30
         """)
  List<DirectMessage> getMessagesByChannelId(int channelId);

  @Query("""
          SELECT dmb.blobUrl
          FROM DirectMessageBlob dmb
          WHERE dmb.messageId = :messageId
         """)
  List<String> getMessageAttachments(int messageId);

  // TODO: Query to fetch next set of messages based on the last sentAt of the last message in the current list.
}
