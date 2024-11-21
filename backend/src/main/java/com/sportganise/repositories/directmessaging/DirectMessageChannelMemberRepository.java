package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberComposite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectMessageChannelMemberRepository extends JpaRepository<DirectMessageChannelMember, DirectMessageChannelMemberComposite> {
}
