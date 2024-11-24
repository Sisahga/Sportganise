package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for Direct Message Channel. */
public interface DirectMessageChannelRepository
    extends JpaRepository<DirectMessageChannel, Integer> {}
