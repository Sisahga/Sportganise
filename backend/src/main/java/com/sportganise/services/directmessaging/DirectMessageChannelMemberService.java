package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import com.sportganise.repositories.directmessaging.DirectMessageChannelMemberRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service Class related to Direct Message Channel Members. */
@Service
public class DirectMessageChannelMemberService {
  private final DirectMessageChannelMemberRepository directMessageChannelMemberRepository;

  /**
   * Service Constructor.
   *
   * @param directMessageChannelMemberRepository DM Channel Member Repository.
   */
  @Autowired
  public DirectMessageChannelMemberService(
      DirectMessageChannelMemberRepository directMessageChannelMemberRepository) {
    this.directMessageChannelMemberRepository = directMessageChannelMemberRepository;
  }

  /**
   * Associates Account entities to a Direct Message Channel in the DB.
   *
   * @param memberIds Ids of members to link to Channel Id.
   * @param channelId Id of DM Channel.
   * @param creatorId Id of the member who created the channel.
   */
  public void saveMembers(List<Integer> memberIds, int channelId, int creatorId) {
    List<DirectMessageChannelMember> dmChannelMembers = new ArrayList<>();
    for (int memberId : memberIds) {
      DirectMessageChannelMember dmChannelMember = new DirectMessageChannelMember();
      // Create the composite key.
      DirectMessageChannelMemberCompositeKey ck = new DirectMessageChannelMemberCompositeKey();
      ck.setChannelId(channelId);
      ck.setAccountId(memberId);
      // Set the composite key as the id of the dmChannelMember
      dmChannelMember.setCompositeKey(ck);
      dmChannelMember.setRead(memberId == creatorId);
      dmChannelMembers.add(dmChannelMember);
    }
    this.directMessageChannelMemberRepository.saveAll(dmChannelMembers);
  }

  /**
   * Marks a channel as read for a specific account.
   *
   * @param channelId The channel id.
   * @param accountId The account id.
   * @return The number of rows affected.
   */
  public int markChannelAsRead(int channelId, int accountId) {
    return this.directMessageChannelMemberRepository.updateChannelMemberReadStatus(
        accountId, channelId);
  }
}
