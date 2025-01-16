package com.sportganise.repositories.organization;

import com.sportganise.entities.organization.AccountOrganization;
import com.sportganise.entities.organization.AccountOrganizationCompositeKey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountOrganizationRepository
    extends JpaRepository<AccountOrganization, AccountOrganizationCompositeKey> {

  List<AccountOrganization> findByCompositeKeyAccountId(Integer accountId);

  @Query(
      "SELECT ao.compositeKey.organizationId FROM AccountOrganization ao WHERE ao.compositeKey.accountId = :accountId")
  List<Integer> getOrganizationIdsByAccountId(Integer accountId);
}
