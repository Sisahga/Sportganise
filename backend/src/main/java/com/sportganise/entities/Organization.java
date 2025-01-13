package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity class for 'Organization' table.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Organization {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "org_id")
  private int orgId;

  private String name;
  private String type;
  private String description;
}
