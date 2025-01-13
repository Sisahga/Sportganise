package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

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
