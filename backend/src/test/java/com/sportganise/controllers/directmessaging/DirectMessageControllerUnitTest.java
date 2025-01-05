package com.sportganise.controllers.directmessaging;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;

import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.dto.directmessaging.SendDirectMessageResponseDto;
import com.sportganise.entities.directmessaging.DirectMessageType;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.directmessaging.DirectMessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@WebMvcTest(controllers = DirectMessageController.class)
class DirectMessageControllerUnitTest {

    @Autowired
    private DirectMessageController directMessageController;

    @MockBean
    private DirectMessageService directMessageService;

    @MockBean
    private AccountRepository accountRepository;

    private SendDirectMessageRequestDto messageRequestDto;
    private SendDirectMessageResponseDto messageResponseDto;

    @BeforeEach
    void setup() {
        MockMultipartFile attachment = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes()
        );

        messageRequestDto = new SendDirectMessageRequestDto();
        messageRequestDto.setChannelId(1);
        messageRequestDto.setSenderId(1);
        messageRequestDto.setMessageContent("Test message");
        messageRequestDto.setAttachments(List.of(attachment));
        messageRequestDto.setSentAt("2024-01-05T10:00:00Z");
        messageRequestDto.setType("CHAT");

        messageResponseDto = new SendDirectMessageResponseDto();
        messageResponseDto.setChannelId(1);
        messageResponseDto.setSenderId(1);
        messageResponseDto.setMessageContent("Test message");
        messageResponseDto.setAttachments(List.of("test.txt"));
        messageResponseDto.setSentAt("2024-01-05T10:00:00Z");
        messageResponseDto.setType(DirectMessageType.CHAT);
    }

    @Test
    void sendDirectMessage_Success() throws IOException {
        given(directMessageService.sendDirectMessage(any(SendDirectMessageRequestDto.class)))
                .willReturn(messageResponseDto);

        SendDirectMessageResponseDto response = directMessageController.sendDirectMessage(messageRequestDto);

        assertNotNull(response);
        assertEquals(messageResponseDto.getChannelId(), response.getChannelId());
        assertEquals(messageResponseDto.getSenderId(), response.getSenderId());
        assertEquals(messageResponseDto.getMessageContent(), response.getMessageContent());
        assertEquals(messageResponseDto.getSentAt(), response.getSentAt());
        assertEquals(messageResponseDto.getType(), response.getType());
        assertEquals(messageResponseDto.getAttachments(), response.getAttachments());
        verify(directMessageService, times(1)).sendDirectMessage(any(SendDirectMessageRequestDto.class));
    }

    @Test
    void sendDirectMessage_WithoutAttachments() throws IOException {
        messageRequestDto.setAttachments(null);
        messageResponseDto.setAttachments(new ArrayList<>());
        given(directMessageService.sendDirectMessage(any(SendDirectMessageRequestDto.class)))
                .willReturn(messageResponseDto);

        SendDirectMessageResponseDto response = directMessageController.sendDirectMessage(messageRequestDto);

        assertNotNull(response);
        assertTrue(response.getAttachments().isEmpty());
        verify(directMessageService, times(1)).sendDirectMessage(any(SendDirectMessageRequestDto.class));
    }

    @Test
    void sendDirectMessage_Error() throws IOException {
        given(directMessageService.sendDirectMessage(any(SendDirectMessageRequestDto.class)))
                .willThrow(new RuntimeException("Test exception"));

        SendDirectMessageResponseDto response = directMessageController.sendDirectMessage(messageRequestDto);

        assertNull(response);
        verify(directMessageService, times(1)).sendDirectMessage(any(SendDirectMessageRequestDto.class));
    }

    @Test
    void sendDirectMessage_WithMultipleAttachments() throws IOException {
        List<MockMultipartFile> attachments = Arrays.asList(
                new MockMultipartFile("file1", "test1.txt", "text/plain", "test content 1".getBytes()),
                new MockMultipartFile("file2", "test2.txt", "text/plain", "test content 2".getBytes())
        );
        messageRequestDto.setAttachments(new ArrayList<>(attachments));
        messageResponseDto.setAttachments(Arrays.asList("test1.txt", "test2.txt"));

        given(directMessageService.sendDirectMessage(any(SendDirectMessageRequestDto.class)))
                .willReturn(messageResponseDto);

        SendDirectMessageResponseDto response = directMessageController.sendDirectMessage(messageRequestDto);

        assertNotNull(response);
        assertEquals(2, response.getAttachments().size());
        verify(directMessageService, times(1)).sendDirectMessage(any(SendDirectMessageRequestDto.class));
    }
}