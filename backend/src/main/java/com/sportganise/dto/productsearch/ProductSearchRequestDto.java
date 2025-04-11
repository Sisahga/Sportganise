package com.sportganise.dto.productsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a product search request. Contains the search query and optional country filter.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequestDto {
  private String query;
  private String country;
}
