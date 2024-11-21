package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectMessageChannelRepository extends JpaRepository<DirectMessageChannel, Integer> {
}
