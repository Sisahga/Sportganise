package com.sportganise.entities.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite key for the AccountOrganization entity, containg account id and org id. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class AccountOrganizationCompositeKey implements Serializable {
  @Column(name = "account_id")
  private Integer accountId;

  @Column(name = "org_id")
  private Integer organizationId;
}
