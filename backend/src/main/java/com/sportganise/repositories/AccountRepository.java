package com.sportganise.repositories;

import com.sportganise.entities.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for 'Account' Entity. Provides custom C.R.U.D. queries through the JpaRepository in
 * JPQL.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
  /**
   * Gets the first names for each account id provided.
   *
   * @param ids Concerned account ids.
   * @return List of first names.
   */
  @Query("SELECT firstName FROM Account WHERE accountId IN :ids")
  List<String> findFirstNamesByAccountId(@Param("ids") List<Integer> ids);

  @Query("SELECT pictureUrl FROM Account WHERE accountId = :accountId")
  String getPictureUrlByAccountId(@Param("accountId") int accountId);

  @Query("SELECT a FROM Account a WHERE a.email = :email")
  Optional<Account> findByEmail(@Param("email") String email);

  @Query("SELECT pictureBlob FROM Account WHERE accountId = :accountId")
  String getPictureBlobByAccountId(@Param("accountId") int accountId);

  @Query("SELECT firstName FROM Account WHERE accountId = :accountId")
  String getFirstNameByAccountId(int accountId);
}
