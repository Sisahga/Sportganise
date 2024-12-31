package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.dto.directmessaging.SendDirectMessageResponseDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.repositories.directmessaging.DirectMessageRepository;
import com.sportganise.services.BlobService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class DirectMessageService {
    private final DirectMessageRepository directMessageRepository;
    private final DirectMessageChannelRepository directMessageChannelRepository;
    private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
    private final BlobService blobService;

    public DirectMessageService(DirectMessageRepository directMessageRepository,
                                DirectMessageChannelRepository directMessageChannelRepository,
                                DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
                                BlobService blobService) {
        this.directMessageRepository = directMessageRepository;
        this.directMessageChannelRepository = directMessageChannelRepository;
        this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
        this.blobService = blobService;
    }

    /**
     * Sends a Direct Message and stores it in the Database while updating related tables.
     *
     * @param sendDirectMessageRequestDto DTO containing the message details.
     * @return DTO containing information about the sent message.
     */
    public SendDirectMessageResponseDto sendDirectMessage(
            SendDirectMessageRequestDto sendDirectMessageRequestDto) throws IOException {
        int channelId = sendDirectMessageRequestDto.getChannelId();
        int senderId = sendDirectMessageRequestDto.getSenderId();
        DirectMessage directMessage = new DirectMessage();
        directMessage.setSenderId(senderId);
        directMessage.setChannelId(channelId);
        directMessage.setContent(sendDirectMessageRequestDto.getMessageContent());
        directMessage.setSentAt(LocalDateTime.parse(sendDirectMessageRequestDto.getSentAt()));
        directMessageRepository.save(directMessage);

        // Update Last Message in Channel Table.
        directMessageChannelRepository.updateLastMessageId(channelId, directMessage.getMessageId());

        // Update Read Status in Channel Member Table.
        directMessageChannelMemberRepository.updateReadStatus(channelId, senderId);

        SendDirectMessageResponseDto sendDirectMessageResponseDto = new SendDirectMessageResponseDto();
        sendDirectMessageResponseDto.setSenderId(senderId);
        sendDirectMessageResponseDto.setChannelId(channelId);
        sendDirectMessageResponseDto.setMessageContent(sendDirectMessageRequestDto.getMessageContent());
        sendDirectMessageResponseDto.setSentAt(sendDirectMessageRequestDto.getSentAt());

        // Upload Attachments to Blob Storage and Persist Message-Attachment relationship in DB.
        String[] attachments = new String[sendDirectMessageRequestDto.getAttachments().length];
        for (int i = 0; i < sendDirectMessageRequestDto.getAttachments().length; i++) {
            MultipartFile file = sendDirectMessageRequestDto.getAttachments()[i];
            String blobUrl = blobService.uploadFile(file, true, directMessage.getMessageId().toString());
            attachments[i] = blobUrl;
        }
        sendDirectMessageResponseDto.setAttachments(attachments);

        // TODO: Implement Nofication Service.

        return sendDirectMessageResponseDto;
    }
}
