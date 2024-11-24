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
   */
  public void saveMembers(List<Integer> memberIds, int channelId) {
    List<DirectMessageChannelMember> dmChannelMembers = new ArrayList<>();
    for (int memberId : memberIds) {
      DirectMessageChannelMember dmChannelMember = new DirectMessageChannelMember();
      // Create the composite key.
      DirectMessageChannelMemberCompositeKey ck = new DirectMessageChannelMemberCompositeKey();
      ck.setChannelId(channelId);
      ck.setAccountId(memberId);
      // Set the composite key as the id of the dmChannelMember
      dmChannelMember.setCompositeKey(ck);
      dmChannelMembers.add(dmChannelMember);
    }
    this.directMessageChannelMemberRepository.saveAll(dmChannelMembers);
  }
}
