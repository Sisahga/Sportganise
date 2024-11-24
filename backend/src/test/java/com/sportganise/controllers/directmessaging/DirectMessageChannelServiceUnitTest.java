package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDTO;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import com.sportganise.services.directmessaging.DirectMessageChannelMemberService;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.anyList;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.times;
import static org.mockito.BDDMockito.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class DirectMessageChannelServiceUnitTest {
    @Mock
    private DirectMessageChannelRepository directMessageChannelRepository;

    @Mock
    private DirectMessageChannelMemberService directMessageChannelMemberService;

    @InjectMocks
    private DirectMessageChannelService directMessageChannelService;

    CreateDirectMessageChannelDTO dmChannelDTO;
    DirectMessageChannel dmChannel;

    @BeforeEach
    public void setUp() {
        dmChannelDTO = new CreateDirectMessageChannelDTO();
        List<Integer> memberIds = Arrays.asList(1, 2);
        String channelName = "Test Channel";
        dmChannelDTO.setChannelName(channelName);
        dmChannelDTO.setMemberIds(memberIds);

        dmChannel = new DirectMessageChannel();
        dmChannel.setChannelId(1);
        dmChannel.setName("Test Channel");
    }

    @Test
    public void createDirectMessageChannelTest_WithChannelName() {
        // Mock the repository save call
        given(directMessageChannelRepository.save(any(DirectMessageChannel.class))).willReturn(dmChannel);
        // Call the service method
        CreateDirectMessageChannelDTO result = directMessageChannelService.createDirectMessageChannel(
                dmChannelDTO.getMemberIds(), dmChannelDTO.getChannelName()
        );

        assertNotNull(result);
        assertEquals(1, dmChannel.getChannelId());
        System.out.println("Channel ID: " + dmChannel.getChannelId());
        assertEquals(dmChannelDTO.getChannelName(), result.getChannelName());
        System.out.println("Channel Name: " + result.getChannelName());
        assertEquals(dmChannelDTO.getMemberIds(), result.getMemberIds());
        System.out.println("Member IDs: " + Arrays.toString(result.getMemberIds().toArray()));

        verify(directMessageChannelRepository, times(1)).save(any(DirectMessageChannel.class));
        verify(directMessageChannelMemberService, times(1)).saveMembers(anyList(), anyInt());
    }
}