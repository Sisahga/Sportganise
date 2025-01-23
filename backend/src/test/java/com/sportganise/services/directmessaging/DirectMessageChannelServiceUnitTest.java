package com.sportganise.services.directmessaging;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.times;
import static org.mockito.BDDMockito.verify;
import static org.mockito.Mockito.*;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.dto.directmessaging.ListDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.exceptions.ChannelExceptions.ChannelDeletionException;
import com.sportganise.exceptions.ChannelExceptions.ChannelNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.services.BlobService;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
public class DirectMessageChannelServiceUnitTest {
  @Mock private DirectMessageChannelRepository directMessageChannelRepository;
  @Mock private DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  @Mock private DirectMessageChannelMemberService directMessageChannelMemberService;
  @Mock private AccountRepository accountRepository;
  @Mock private DirectMessageService directMessageService;
  @Mock private BlobService blobService;
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
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            dmChannelDTO.getMemberIds(), dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertNull(result.getChannelName());
    assertEquals(dmChannelDTO.getMemberIds(), result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(), anyInt());
  }

  @Test
  public void createDirectMessageChannelTest_WithoutChannelNameShort() {
    dmChannel.setName(null);
    dmChannel.setType("SIMPLE");
    dmChannelDTO.setChannelName(null);
    given(accountRepository.findFirstNamesByAccountId(dmChannelDTO.getMemberIds()))
        .willReturn(Arrays.asList("Brett", "Aaron"));
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            dmChannelDTO.getMemberIds(), dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertEquals(dmChannel.getName(), result.getChannelName());
    assertEquals(dmChannel.getType(), result.getChannelType());
    assertEquals(dmChannelDTO.getMemberIds(), result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(), anyInt());
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
    given(directMessageChannelRepository.save(any(DirectMessageChannel.class)))
        .willReturn(dmChannel);
    CreateDirectMessageChannelDto result =
        directMessageChannelService.createDirectMessageChannel(
            longTestMemberIds, dmChannelDTO.getChannelName(), 1);

    assertNotNull(result);
    assertEquals(1, dmChannel.getChannelId());
    assertEquals(dmChannel.getName(), result.getChannelName());
    assertEquals(dmChannel.getType(), result.getChannelType());
    assertEquals(longTestMemberIds, result.getMemberIds());

    verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
    verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt(), anyInt());
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

    Exception exception = assertThrows(ChannelDeletionException.class, () -> {
      directMessageChannelService.deleteDirectMessageChannel(channelId);
    });

    assertEquals("Failed to delete channel: Channel not found.", exception.getMessage());

    verify(directMessageChannelRepository, times(1)).existsById(channelId);
    verify(directMessageChannelRepository, never()).deleteById(anyInt());
    verify(directMessageChannelMemberRepository, never())
            .deleteDirectMessageChannelMemberByChannelId(anyInt());
  }


  @Test
  public void getDirectMessageChannelsTest_HasChannels() {
    int accountId = 1;

    // Mock account existence
    given(accountRepository.existsById(accountId)).willReturn(true);

    ListDirectMessageChannelDto channel1 =
            new ListDirectMessageChannelDto(
                    1, "GROUP", "Channel 1", "image_blob_1", "I love you.", false, ZonedDateTime.now());
    ListDirectMessageChannelDto channel2 =
            new ListDirectMessageChannelDto(2, "SIMPLE", null, null, null, true, null);
    List<ListDirectMessageChannelDto> expectedChannels = Arrays.asList(channel1, channel2);

    given(directMessageChannelRepository.getDirectMessageChannelsByAccountId(accountId))
            .willReturn(expectedChannels);

    given(directMessageChannelMemberRepository.getOtherMemberIdInSimpleChannel(2, accountId))
            .willReturn(2);
    given(accountRepository.getFirstNameByAccountId(2)).willReturn("John Doe");
    given(accountRepository.getPictureUrlByAccountId(2)).willReturn("image_blob_2");

    List<ListDirectMessageChannelDto> actualChannels =
            directMessageChannelService.getDirectMessageChannels(accountId);

    assertEquals(2, actualChannels.size());

    // Validate channel details
    assertEquals("Channel 1", actualChannels.get(0).getChannelName());
    assertEquals("John Doe", actualChannels.get(1).getChannelName());
    assertEquals("image_blob_2", actualChannels.get(1).getChannelImageBlob());

    verify(accountRepository, times(1)).existsById(accountId);
    verify(directMessageChannelRepository, times(1)).getDirectMessageChannelsByAccountId(accountId);
    verify(directMessageChannelMemberRepository, times(1))
            .getOtherMemberIdInSimpleChannel(2, accountId);
  }



  @Test
  public void getDirectMessageChannelsTest_HasNoChannels() {
    int accountId = 1;

    // Mock valid account existence
    given(accountRepository.existsById(accountId)).willReturn(true);

    // Mock empty channel list
    given(directMessageChannelRepository.getDirectMessageChannelsByAccountId(accountId))
            .willReturn(Collections.emptyList());

    List<ListDirectMessageChannelDto> actualChannels =
            directMessageChannelService.getDirectMessageChannels(accountId);

    // Assert that the returned list is empty
    assertEquals(0, actualChannels.size());
    assertEquals(Collections.emptyList(), actualChannels);

    // Verify interactions
    verify(accountRepository, times(1)).existsById(accountId);
    verify(directMessageChannelRepository, times(1)).getDirectMessageChannelsByAccountId(accountId);

    // Ensure no SIMPLE channel logic was invoked
    verify(directMessageChannelMemberRepository, never())
            .getOtherMemberIdInSimpleChannel(anyInt(), anyInt());
    verify(accountRepository, never()).getFirstNameByAccountId(anyInt());
    verify(accountRepository, never()).getPictureUrlByAccountId(anyInt());
  }


  @Test
  public void getDirectMessageChannels_ChannelsWithNoMessages() {
    int accountId = 1;

    // Mock account existence
    given(accountRepository.existsById(accountId)).willReturn(true);

    // Create a channel with no messages or image blobs
    ListDirectMessageChannelDto channel =
            new ListDirectMessageChannelDto(1, "GROUP", "Channel 1", null, null, true, null);

    // Mock repository response for channels
    given(directMessageChannelRepository.getDirectMessageChannelsByAccountId(accountId))
            .willReturn(List.of(channel));

    List<ListDirectMessageChannelDto> actualChannels =
            directMessageChannelService.getDirectMessageChannels(accountId);

    // Assertions
    assertEquals(1, actualChannels.size());
    assertNull(actualChannels.getFirst().getChannelImageBlob());
    assertNull(actualChannels.getFirst().getLastMessage());
    assertNull(actualChannels.getFirst().getLastEvent());

    // Verify repository interactions
    verify(accountRepository, times(1)).existsById(accountId);
    verify(directMessageChannelRepository, times(1)).getDirectMessageChannelsByAccountId(accountId);
  }


  @Test
  void renameGroupChannel_Success() {
    int channelId = 1;
    String newName = "New Channel Name";
    when(directMessageChannelRepository.renameChannel(channelId, newName)).thenReturn(1);

    assertDoesNotThrow(() -> directMessageChannelService.renameGroupChannel(channelId, newName));

    verify(directMessageChannelRepository).renameChannel(channelId, newName);
  }

  @Test
  void renameGroupChannel_ChannelNotFound() {
    int channelId = 1;
    String newName = "New Channel Name";
    when(directMessageChannelRepository.renameChannel(channelId, newName)).thenReturn(0);

    ChannelNotFoundException exception =
        assertThrows(
            ChannelNotFoundException.class,
            () -> directMessageChannelService.renameGroupChannel(channelId, newName));

    assertEquals("Channel not found", exception.getMessage());
  }

  @Test
  public void updateChannelPicture_Success() throws IOException {
    int channelId = 1;
    int userId = 1;
    MultipartFile image = mock(MultipartFile.class);
    String oldImageBlob = "old-image-blob";
    String newImageBlob = "new-image-blob";

    given(directMessageChannelRepository.getDirectMessageChannelImageBlob(channelId))
        .willReturn(oldImageBlob);
    given(blobService.uploadFile(image, false, null, userId)).willReturn(newImageBlob);
    given(directMessageChannelRepository.updateChannelImage(channelId, newImageBlob)).willReturn(1);

    assertDoesNotThrow(
        () -> directMessageChannelService.updateChannelPicture(channelId, image, userId));

    verify(directMessageChannelRepository).getDirectMessageChannelImageBlob(channelId);
    verify(blobService).uploadFile(image, false, null, userId);
    verify(directMessageChannelRepository).updateChannelImage(channelId, newImageBlob);
    verify(blobService).deleteFile(oldImageBlob);
  }

  @Test
  public void updateChannelPicture_ChannelNotFound() throws IOException {
    int channelId = 1;
    int userId = 1;
    MultipartFile image = mock(MultipartFile.class);
    String oldImageBlob = "old-image-blob";
    String newImageBlob = "new-image-blob";

    given(directMessageChannelRepository.getDirectMessageChannelImageBlob(channelId))
            .willReturn(oldImageBlob); // Simulate getting the old image blob URL
    given(blobService.uploadFile(image, false, null, userId)).willReturn(newImageBlob); // Simulate file upload
    given(directMessageChannelRepository.updateChannelImage(channelId, newImageBlob)).willReturn(0); // Simulate no rows affected

    assertThrows(
            ChannelNotFoundException.class,
            () -> directMessageChannelService.updateChannelPicture(channelId, image, userId)
    );

    verify(directMessageChannelRepository).getDirectMessageChannelImageBlob(channelId);
    verify(blobService).uploadFile(image, false, null, userId);
    verify(directMessageChannelRepository).updateChannelImage(channelId, newImageBlob);
    verify(blobService, never()).deleteFile(anyString()); // Ensure deleteFile was not called
  }

}
