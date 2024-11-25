package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * API DTO for retrieving a list of all DM Channels for an account.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListDirectMessageChannelDto {
    private Integer channelId;
    private String channelType;
    private String channelName;
    private String channelImageBlob;
    private String lastMessage;
    private Boolean read;
    private LocalDateTime lastEvent;
}
