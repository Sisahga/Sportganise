package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for a Direct Channel Member. */
public interface DirectMessageChannelMemberRepository
    extends JpaRepository<DirectMessageChannelMember, DirectMessageChannelMemberCompositeKey> {}
