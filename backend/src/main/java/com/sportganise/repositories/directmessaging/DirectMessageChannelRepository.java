package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Repository for Direct Message Channel. */
public interface DirectMessageChannelRepository
    extends JpaRepository<DirectMessageChannel, Integer> {
    /**
     * Query that gets DTO object for all Direct Message Channels for an account.
     *
     * @param accountId Id of the account to get Direct Message Channels for.
     */
    @Query("""
            SELECT c.channelId, c.name as channelName, c.type as channelType, c.imageBlob as channelImageBlob,
                        cm.read, m.content as lastMessage, m.sentAt as lastEvent
            FROM DirectMessageChannel c
            INNER JOIN DirectMessageChannelMember cm ON c.channelId = cm.compositeKey.channelId
            LEFT JOIN DirectMessage m ON c.channelId = m.channelId AND m.sentAt = (
                    SELECT MAX(sentAt) FROM DirectMessage WHERE channelId = c.channelId
                )
            WHERE cm.compositeKey.accountId = :accountId
            """)
    void getDirectMessageChannelsByAccountId(int accountId);
}
