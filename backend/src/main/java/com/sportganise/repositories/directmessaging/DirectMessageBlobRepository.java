package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageBlob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectMessageBlobRepository extends JpaRepository<DirectMessageBlob, Integer> {
}
