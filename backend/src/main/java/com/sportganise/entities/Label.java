package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Label table. */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "label")
public class Label {

  @Id
  @Column(name = "label_id")
  private Integer labelId;

  @Column(name = "org_id")
  private Integer orgId;

  @Column(name = "name")
  private String labelName;
}
