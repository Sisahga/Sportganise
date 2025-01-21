package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

import com.sportganise.dto.directmessaging.DirectMessageDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.entities.directmessaging.DirectMessage;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.repositories.directmessaging.DirectMessageRepository;
import com.sportganise.services.BlobService;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
public class DirectMessageServiceUnitTest {
  @Mock private DirectMessageRepository directMessageRepository;
  @Mock private DirectMessageChannelRepository directMessageChannelRepository;
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  @Mock private BlobService blobService;
  @InjectMocks private DirectMessageService directMessageService;

  private SendDirectMessageRequestDto sendDirectMessageRequestDto;

  @BeforeEach
  public void setUp() {
    sendDirectMessageRequestDto = new SendDirectMessageRequestDto();
    sendDirectMessageRequestDto.setChannelId(1);
    sendDirectMessageRequestDto.setSenderId(2);
    sendDirectMessageRequestDto.setMessageContent("Hello, World!");
    sendDirectMessageRequestDto.setSentAt(ZonedDateTime.now().toString());
    sendDirectMessageRequestDto.setAttachments(Collections.emptyList());
    sendDirectMessageRequestDto.setType("CHAT");

    // Mock DirectMessageRepository save method
    given(directMessageRepository.save(any(DirectMessage.class)))
        .willAnswer(
            invocation -> {
              DirectMessage message = invocation.getArgument(0);
              message.setMessageId(
                  1); // Manually assign ID for message as if it were from Postgres.
              return message;
            });
  }

  @Test
  public void sendDirectMessageTest_WithoutAttachments() throws IOException {
    DirectMessageDto response = directMessageService.sendDirectMessage(sendDirectMessageRequestDto);

    assertNotNull(response);
    assertEquals(1, response.getChannelId());
    assertEquals(2, response.getSenderId());
    assertEquals("Hello, World!", response.getMessageContent());
    assertTrue(response.getAttachments().isEmpty());

    verify(directMessageRepository, times(1)).save(any(DirectMessage.class));
    verify(directMessageChannelRepository, times(1)).updateLastMessageId(1, 1);
    verify(directMessageChannelMemberRepository, times(1)).updateChannelMemberReadStatus(2, 1);
    verify(blobService, times(0)).uploadFile(any(MultipartFile.class), eq(true), anyString(), anyInt());
  }

  @Test
  public void sendDirectMessageTest_WithAttachments() throws IOException {
    MultipartFile mockFile1 = mock(MultipartFile.class);
    MultipartFile mockFile2 = mock(MultipartFile.class);

    sendDirectMessageRequestDto.setAttachments(List.of(mockFile1, mockFile2));

    given(blobService.uploadFile(any(MultipartFile.class), eq(true), anyString(), anyInt()))
        .willReturn("https://mockblobstorage.com/file1.jpg")
        .willReturn("https://mockblobstorage.com/file2.jpg");

    DirectMessageDto response = directMessageService.sendDirectMessage(sendDirectMessageRequestDto);

    assertNotNull(response);
    assertEquals(1, response.getChannelId());
    assertEquals(2, response.getSenderId());
    assertEquals("Hello, World!", response.getMessageContent());
    assertEquals(2, response.getAttachments().size());
    assertTrue(response.getAttachments().contains("https://mockblobstorage.com/file1.jpg"));
    assertTrue(response.getAttachments().contains("https://mockblobstorage.com/file2.jpg"));

    verify(directMessageRepository, times(1)).save(any(DirectMessage.class));
    verify(directMessageChannelRepository, times(1)).updateLastMessageId(1, 1);
    verify(directMessageChannelMemberRepository, times(1)).updateChannelMemberReadStatus(2, 1);
    verify(blobService, times(2)).uploadFile(any(MultipartFile.class), eq(true), eq("1"), eq(2));
  }
}
