package com.sportganise.repositories;

import com.sportganise.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for 'Account' Entity Provides custom C.R.U.D. queries through the JpaRepository in
 * JPQL
 */
@Repository // Indicates that this is a Spring Data repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    /**
     * Gets the first names for each account id provided
     * @param ids Concerned account ids
     * @return List of first names
     */
    @Query("SELECT firstName FROM Account WHERE accountId = :ids")
    List<String> findFirstNamesByAccountId(@Param("ids") Integer[] ids);
}
