package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Embedded entity for an account's address. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
  @Column(name = "address_line")
  private String line;

  @Column(name = "address_city")
  private String city;

  @Column(name = "address_province")
  private String province;

  @Column(name = "address_country")
  private String country;

  @Column(name = "address_postal_code")
  private String postalCode;
}
