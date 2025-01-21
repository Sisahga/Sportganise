package com.sportganise.controllers.directmessaging;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.directmessaging.BlockUserRequestDto;
import com.sportganise.services.directmessaging.BlocklistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = BlocklistController.class)
@AutoConfigureMockMvc
public class BlocklistControllerUnitTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private BlocklistService blocklistService;

  @Autowired private ObjectMapper objectMapper;

  @Test
  public void blockUser_Success() throws Exception {
    BlockUserRequestDto requestDto = new BlockUserRequestDto();
    requestDto.setAccountId(1);
    requestDto.setBlockedId(2);
    requestDto.setChannelId(1);

    doNothing()
        .when(blocklistService)
        .blockUser(requestDto.getAccountId(), requestDto.getBlockedId());

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/blocklist/block")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
        .andExpect(status().isNoContent())
        .andExpect(jsonPath("$.statusCode").value(204))
        .andExpect(jsonPath("$.message").value("User blocked successfully"))
        .andExpect(jsonPath("$.data").isEmpty());

    verify(blocklistService, times(1))
        .blockUser(requestDto.getAccountId(), requestDto.getBlockedId());
  }

  @Test
  public void unblockUser_Success() throws Exception {
    int accountId = 1;
    int blockedId = 2;

    doNothing().when(blocklistService).unblockUser(accountId, blockedId);

    mockMvc
        .perform(
            MockMvcRequestBuilders.delete(
                    "/api/blocklist/unblock/{accountId}/{blockedId}", accountId, blockedId)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent())
        .andExpect(jsonPath("$.statusCode").value(204))
        .andExpect(jsonPath("$.message").value("User unblocked successfully"))
        .andExpect(jsonPath("$.data").isEmpty());

    verify(blocklistService, times(1)).unblockUser(accountId, blockedId);
  }
}
