package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite Key Id for LabelAccount. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class LabelAccountId implements Serializable {

  @Column(name = "account_id")
  private Integer accountId;

  @Column(name = "label_id")
  private Integer labelId;
}
