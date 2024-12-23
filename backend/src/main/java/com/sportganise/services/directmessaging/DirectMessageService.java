package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.SendDirectMessageDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.repositories.directmessaging.DirectMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DirectMessageService {
    private final DirectMessageRepository directMessageRepository;
    private final DirectMessageChannelRepository directMessageChannelRepository;
    private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;

    public DirectMessageService(DirectMessageRepository directMessageRepository,
                                DirectMessageChannelRepository directMessageChannelRepository,
                                DirectMessageChannelMemberRepository directMessageChannelMemberRepository) {
        this.directMessageRepository = directMessageRepository;
        this.directMessageChannelRepository = directMessageChannelRepository;
        this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    }

    /**
     * Sends a Direct Message and stores it in the Database while updating related tables.
     *
     * @param sendDirectMessageDto DTO containing the message details.
     * @return DTO containing information about the sent message.
     */
    public SendDirectMessageDto sendDirectMessage(SendDirectMessageDto sendDirectMessageDto) {
        int channelId = sendDirectMessageDto.getChannelId();
        int senderId = sendDirectMessageDto.getSenderId();
        DirectMessage directMessage = new DirectMessage();
        directMessage.setSenderId(senderId);
        directMessage.setChannelId(channelId);
        directMessage.setContent(sendDirectMessageDto.getMessageContent());
        directMessage.setSentAt(LocalDateTime.parse(sendDirectMessageDto.getSentAt()));
        directMessageRepository.save(directMessage);

        // Update Last Message in Channel Table.
        directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());

        // Update Read Status in Channel Member Table.
        directMessageChannelMemberRepository.updateReadStatus(channelId, senderId);

        // TODO: Create Attachment Entity, Repository, and Service.
        // TODO: Create Attachment table and Store attachments with Attachment Service.
        // TODO: Implement Nofication Service.

        return sendDirectMessageDto;
    }
}
