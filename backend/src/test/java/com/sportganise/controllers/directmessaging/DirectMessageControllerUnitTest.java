package com.sportganise.controllers.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.sportganise.dto.directmessaging.DirectMessageDto;
import com.sportganise.dto.directmessaging.SendDirectMessageRequestDto;
import com.sportganise.entities.directmessaging.DirectMessageType;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.directmessaging.DirectMessageService;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@WebMvcTest(controllers = DirectMessageController.class)
class DirectMessageControllerUnitTest {
  @Autowired private DirectMessageController directMessageController;
  @MockBean private DirectMessageService directMessageService;
  @MockBean private SimpMessagingTemplate simpMessagingTemplate;
  @MockBean private AccountRepository accountRepository;

  private SendDirectMessageRequestDto messageRequestDto;
  private DirectMessageDto messageResponseDto;

  @BeforeEach
  void setup() {
    messageRequestDto = new SendDirectMessageRequestDto();
    messageRequestDto.setChannelId(1);
    messageRequestDto.setSenderId(1);
    messageRequestDto.setMessageContent("Test message");
    messageRequestDto.setSentAt("2024-01-05T10:00:00Z");
    messageRequestDto.setType("CHAT");

    messageResponseDto = new DirectMessageDto();
    messageResponseDto.setChannelId(1);
    messageResponseDto.setSenderId(1);
    messageResponseDto.setMessageContent("Test message");
    messageResponseDto.setSentAt("2024-01-05T10:00:00Z");
    messageResponseDto.setType(DirectMessageType.CHAT);
  }

  @Test
  void sendDirectMessage_Success() throws IOException {
    given(directMessageService.sendDirectMessage(any(SendDirectMessageRequestDto.class)))
        .willReturn(messageResponseDto);

    DirectMessageDto response = directMessageController.sendDirectMessage(messageRequestDto);

    assertNotNull(response);
    assertEquals(messageResponseDto.getChannelId(), response.getChannelId());
    assertEquals(messageResponseDto.getSenderId(), response.getSenderId());
    assertEquals(messageResponseDto.getMessageContent(), response.getMessageContent());
    assertEquals(messageResponseDto.getSentAt(), response.getSentAt());
    assertEquals(messageResponseDto.getType(), response.getType());
    verify(directMessageService, times(1))
        .sendDirectMessage(any(SendDirectMessageRequestDto.class));
  }
}
