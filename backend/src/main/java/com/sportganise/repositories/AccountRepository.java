package com.sportganise.repositories;

import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.AccountPermissions;
import com.sportganise.entities.Label;
import com.sportganise.entities.account.Account;
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

  @Query("SELECT firstName FROM Account WHERE accountId = :accountId")
  String getFirstNameByAccountId(int accountId);

  @Query(
      """
      SELECT a.accountId  AS accountId,
             a.firstName  AS firstName,
             a.lastName   AS lastName,
             a.email      AS email,
             a.pictureUrl AS pictureUrl,
             a.type       AS type
      FROM Account a
      """)
  List<AccountPermissions> findAccountPermissions();

  @Query(
      """
         SELECT new com.sportganise.dto.account.AccountDetailsDirectMessaging(
                 a.accountId, a.firstName, a.lastName, a.pictureUrl, a.type, a.phone)
             FROM Account a
             JOIN AccountOrganization ao ON a.accountId = ao.compositeKey.accountId
             LEFT JOIN Blocklist b1 ON a.accountId = b1.compositeBlocklistId.blockedId
                 AND b1.compositeBlocklistId.accountId = :currentUserId
             LEFT JOIN Blocklist b2 ON a.accountId = b2.compositeBlocklistId.accountId
                 AND b2.compositeBlocklistId.blockedId = :currentUserId
             WHERE ao.compositeKey.organizationId = :organizationId
                 AND b1.compositeBlocklistId IS NULL
                 AND b2.compositeBlocklistId IS NULL
                 AND a.accountId <> :currentUserId
        """)
  List<AccountDetailsDirectMessaging> getAllNonBlockedAccountsByOrganization(
      int organizationId, int currentUserId);

  /**
   * Gets the label IDs for a given account ID and organization ID.
   *
   * @param accountId The ID of the account.
   * @param orgId The ID of the organization.
   * @return The label IDs.
   */
  @Query(
      """
          SELECT la.labelAccountsId.labelId
          FROM LabelAccount la
          JOIN Label l ON la.labelAccountsId.labelId = l.labelId
          WHERE la.labelAccountsId.accountId = :accountId
            AND l.orgId = :orgId
          """)
  List<Integer> getLabelIdsByAccountIdAndOrgId(
      @Param("accountId") Integer accountId, @Param("orgId") Integer orgId);

  /**
   * Gets a label by its ID.
   *
   * @param labelId The ID of the label.
   * @return The label.
   */
  @Query("SELECT l FROM Label l WHERE l.labelId = :labelId")
  Label getLabelById(@Param("labelId") Integer labelId);

  @Query("SELECT email FROM Account WHERE  accountId = :id")
  String getEmailByAccountId(int id);
}
