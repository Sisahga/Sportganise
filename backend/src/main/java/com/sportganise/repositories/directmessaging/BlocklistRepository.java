package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.Blocklist;
import com.sportganise.entities.directmessaging.BlocklistCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Repository for blocking users. */
@Repository
public interface BlocklistRepository extends JpaRepository<Blocklist, BlocklistCompositeKey> {}
