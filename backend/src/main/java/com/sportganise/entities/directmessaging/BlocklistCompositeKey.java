package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite key for the blocklist table. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class BlocklistCompositeKey implements Serializable {
  @Column(name = "account_id")
  private Integer accountId;

  @Column(name = "blocked_id")
  private Integer blockedId;
}
