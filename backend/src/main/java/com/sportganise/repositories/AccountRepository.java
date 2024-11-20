package com.sportganise.repositories;

import com.sportganise.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for 'Account' Entity Provides custom C.R.U.D. queries through the JpaRepository in
 * JPQL
 */
@Repository // Indicates that this is a Spring Data repository
public interface AccountRepository extends JpaRepository<Account, Integer> {}
