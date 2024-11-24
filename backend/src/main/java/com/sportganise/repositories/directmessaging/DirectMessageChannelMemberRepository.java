package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannelMember;
import com.sportganise.entities.directmessaging.DirectMessageChannelMemberCompositeKey;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Repository for a Direct Channel Member. */
public interface DirectMessageChannelMemberRepository
    extends JpaRepository<DirectMessageChannelMember, DirectMessageChannelMemberCompositeKey> {
  @Transactional
  @Modifying
  @Query("DELETE FROM DirectMessageChannelMember d WHERE d.compositeKey.channelId = :channelId")
  void deleteDirectMessageChannelMemberByChannelId(@Param("channelId") int channelId);
}
