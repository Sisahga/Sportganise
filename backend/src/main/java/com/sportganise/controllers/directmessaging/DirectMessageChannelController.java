package com.sportganise.controllers.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDTO;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling HTTP requests related to Direct Message Channels
 */
@RestController
@RequestMapping("/api/messaging")
@CrossOrigin("*")
public class DirectMessageChannelController {
    private final DirectMessageChannelService directMessageChannelService;

    /**
     * Controller Constructor.
     * @param directMessageChannelService Direct Message Channel Service
     */
    @Autowired
    public DirectMessageChannelController(DirectMessageChannelService directMessageChannelService) {
        this.directMessageChannelService = directMessageChannelService;
    }

    /**
     * Endpoint /api/messaging/create-channel: Post Mapping for Creating a new Direct Message Channel
     * @param channelDTO API object for Created Channel Response
     * @return HTTP Code 201 and Created DM Channel DTO
     */
    @PostMapping("/create-channel")
    public ResponseEntity<CreateDirectMessageChannelDTO> createChannel(@RequestBody CreateDirectMessageChannelDTO channelDTO) {
        String channelName = channelDTO.getChannelName();
        List<Integer> memberIds = channelDTO.getMemberIds();
        CreateDirectMessageChannelDTO dmChannelDTO = this.directMessageChannelService.createDirectMessageChannel(memberIds, channelName);

        return new ResponseEntity<>(dmChannelDTO, HttpStatus.CREATED);
    }
}
