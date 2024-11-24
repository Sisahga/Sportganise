package com.sportganise.services.directmessaging;

import com.sportganise.dto.directmessaging.CreateDirectMessageChannelDto;
import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service Class related to Direct Message Channel. */
@Service
public class DirectMessageChannelService {
  private final DirectMessageChannelRepository directMessageChannelRepository;
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;
  private final AccountRepository accountRepository;
  private final DirectMessageChannelMemberService directMessageChannelMemberService;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelRepository Direct Message Channel Repository.
   * @param accountRepository Account Repository.
   * @param directMessageChannelMemberService Direct Message Channel Member Repository.
   */
  @Autowired
  public DirectMessageChannelService(
      DirectMessageChannelRepository directMessageChannelRepository,
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository,
      AccountRepository accountRepository,
      DirectMessageChannelMemberService directMessageChannelMemberService) {
    this.directMessageChannelRepository = directMessageChannelRepository;
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
    this.accountRepository = accountRepository;
    this.directMessageChannelMemberService = directMessageChannelMemberService;
  }

  /**
   * Creates a new DM Channel and stores it in the Database.
   *
   * @param memberIds String of member ids, separated by a ',' (min. 2 members)
   * @param channelName Name of the message channel. Can be null.
   * @return DM Channel created.
   */
  public CreateDirectMessageChannelDto createDirectMessageChannel(
      List<Integer> memberIds, String channelName) {
    /*
    Set the Channel Name to be the first names of members
    in the channel if it is null or empty.
    */
    if (channelName == null || channelName.isBlank()) {
      StringBuilder channelNameBuilder = createChannelNameFromMembers(memberIds);
      channelName = channelNameBuilder.toString();
    }
    DirectMessageChannel dmChannel = new DirectMessageChannel();
    dmChannel.setName(channelName);
    if (memberIds.size() > 2) {
      dmChannel.setType("GROUP");
    } else {
      dmChannel.setType("SIMPLE");
    }

    LocalDateTime timestamp = LocalDateTime.now();
    dmChannel.setCreatedAt(timestamp);

    DirectMessageChannel createdDmChannel = directMessageChannelRepository.save(dmChannel);
    int createdDmChannelId = createdDmChannel.getChannelId();
    // Create Channel Members
    this.directMessageChannelMemberService.saveMembers(memberIds, createdDmChannelId);

    // Return the DM Channel DTO
    CreateDirectMessageChannelDto dmChannelDto = new CreateDirectMessageChannelDto();
    dmChannelDto.setChannelId(createdDmChannelId);
    dmChannelDto.setChannelName(createdDmChannel.getName());
    dmChannelDto.setChannelType(createdDmChannel.getType());
    dmChannelDto.setMemberIds(memberIds);
    dmChannelDto.setCreatedAt(timestamp.toString());

    return dmChannelDto;
  }

  /**
   * Deletes a DM Channel and all of its channel members.
   *
   * @param channelId The ID of the channel to delete.
   */
  public boolean deleteDirectMessageChannel(int channelId) {
    if (directMessageChannelRepository.existsById(channelId)) {
      // Delete the channel.
      directMessageChannelRepository.deleteById(channelId);
      // Delete all related channel members.
      directMessageChannelMemberRepository.deleteDirectMessageChannelMemberByChannelId(channelId);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Formats the channel name to be the first names of all members in the channel if no name was
   * given.
   *
   * @param memberIds String of member ids, separated by a ','
   * @return Formatted string for the channel name composed of the name of the members
   */
  private StringBuilder createChannelNameFromMembers(List<Integer> memberIds) {
    List<String> firstNames = this.accountRepository.findFirstNamesByAccountId(memberIds);

    StringBuilder channelNameBuilder = new StringBuilder();
    for (int i = 0; i < firstNames.size(); i++) {
      // Can't have channel name longer than 50 chars.
      if (i != firstNames.size() - 1
          && channelNameBuilder.length()
                  + firstNames.get(i).length()
                  + firstNames.get(i + 1).length()
              > 44) {
        channelNameBuilder.append("and ");
        channelNameBuilder.append(firstNames.get(i));
        return channelNameBuilder;
      }
      channelNameBuilder.append(firstNames.get(i));
      if (i == memberIds.size() - 2) {
        // Appends ' and ' if it's the before last element of the list.
        // Ex: "Max and James", not "Max, James".
        channelNameBuilder.append(" and ");
      } else if (i < memberIds.size() - 1) {
        channelNameBuilder.append(", ");
      }
    }
    return channelNameBuilder;
  }
}
