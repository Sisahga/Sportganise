package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.times;
import static org.mockito.BDDMockito.verify;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.anyList;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;

import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class DirectMessageChannelServiceUnitTest {
  @Mock private DirectMessageChannelRepository directMessageChannelRepository;

  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;

  @Mock private DirectMessageChannelMemberService directMessageChannelMemberService;

  @Mock private AccountRepository accountRepository;

  @InjectMocks private DirectMessageChannelService directMessageChannelService;

  CreateDirectMessageChannelDto dmChannelDTO;
  DirectMessageChannel dmChannel;

  @BeforeEach
  public void setUp() {
    dmChannelDTO = new CreateDirectMessageChannelDto();
    List<Integer> memberIds = Arrays.asList(1, 2);
    dmChannelDTO.setMemberIds(memberIds);

    dmChannel = new DirectMessageChannel();
    dmChannel.setChannelId(1);
  }

  @Test
  public void createDirectMessageChannelTest_WithChannelName() {
    dmChannel.setName("Test Channel");
    dmChannelDTO.setChannelName("Test Channel");
    // Mock the repository save call
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    // Call the service method
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            dmChannelDTO.getMemberIds(), dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertEquals(dmChannelDTO.getChannelName(), result.getChannelName());
    assertEquals(dmChannelDTO.getMemberIds(), result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(),
            anyInt());
  }

  @Test
  public void createDirectMessageChannelTest_WithoutChannelNameShort() {
    dmChannel.setName("Brett and Aaron");
    dmChannel.setType("SIMPLE");
    dmChannelDTO.setChannelName(null);
    given(accountRepository.findFirstNamesByAccountId(dmChannelDTO.getMemberIds()))
        .willReturn(Arrays.asList("Brett", "Aaron"));
    // Mock the repository save call
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    // Call the service method
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            dmChannelDTO.getMemberIds(), dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertEquals(dmChannel.getName(), result.getChannelName());
    assertEquals(dmChannel.getType(), result.getChannelType());
    assertEquals(dmChannelDTO.getMemberIds(), result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(),
            anyInt());
  }

  @Test
  public void createDirectMessageChannelTest_WithoutChannelNameLong() {
    dmChannel.setName("James, Mark, Brett, Alex, Mindy, and Frederic");
    dmChannel.setType("GROUP");
    dmChannelDTO.setChannelName(null);

    List<Integer> longTestMemberIds = Arrays.asList(1, 2, 3, 4, 5, 6, 7);

    given(accountRepository.findFirstNamesByAccountId(longTestMemberIds))
        .willReturn(
            Arrays.asList("James", "Mark", "Brett", "Alex", "Mindy", "Frederic", "Cleopatra"));
    // Mock the repository save call
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    // Call the service method
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            longTestMemberIds, dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertEquals(dmChannel.getName(), result.getChannelName());
    assertEquals(dmChannel.getType(), result.getChannelType());
    assertEquals(longTestMemberIds, result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(),
            anyInt());
  }

  @Test
  public void deleteDirectMessageChannelTest_ChannelExists() {
    int channelId = 1;

    given(directMessageChannelRepository.existsById(channelId)).willReturn(true);

    boolean result = directMessageChannelService.deleteDirectMessageChannel(channelId);

    assertTrue(result);
    verify(directMessageChannelRepository, times(1)).existsById(channelId);
    verify(directMessageChannelRepository, times(1)).deleteById(channelId);
    verify(directMessageChannelMemberRepository, times(1))
        .deleteDirectMessageChannelMemberByChannelId(channelId);
  }

  @Test
  public void deleteDirectMessageChannelTest_ChannelDoesNotExist() {
    int channelId = 1;

    given(directMessageChannelRepository.existsById(channelId)).willReturn(false);

    boolean result = directMessageChannelService.deleteDirectMessageChannel(channelId);

    assertFalse(result);
    verify(directMessageChannelRepository, times(1)).existsById(channelId);
    verify(directMessageChannelRepository, times(0)).deleteById(anyInt());
    verify(directMessageChannelMemberRepository, times(0))
        .deleteDirectMessageChannelMemberByChannelId(anyInt());
  }
}
